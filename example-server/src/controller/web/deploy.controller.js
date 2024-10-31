const { NodeSSH } = require('node-ssh')
const {
  createProject,
  updateProject,
  deleteProject,
  getProjectList,
  createDeployServer,
  getDeployServerInfo,
} = require("../../service");
const { databaseError } = require("../../constant");
const { encryptRichText, decryptRichText, decryptCode, ompatiblePath, verifyFile, verifyFolder } = require("../../utils");

const ssh = new NodeSSH();

class DeployController {
  async createDeployServerCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await createDeployServer({ ...params });
      const data = {
        ...res._doc,
        id: res._id
      }
      delete data._id;
      delete data.__v;
      ctx.body = {
        code: 200,
        success: true,
        message: "操作成功",
        data,
      };
    } catch (error) {
      console.error("createDeployServerCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getDeployServerInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getDeployServerInfo({ ...params });
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取服务器信息成功",
          data: res,
        }
      }
    } catch (error) {
      console.error("getDeployServerInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async createProjectCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await createProject({ ...params });
      if (!res.created) {
        ctx.body = {
          code: 200,
          success: true,
          message: "添加成功",
          data: res._id,
        };
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: "该项目已存在",
          data: res,
        };
      }
    } catch (error) {
      console.error("createProjectCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getProjectListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getProjectList({ ...params });
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取项目列表成功",
          data: res,
        };
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: "暂无数据",
        };
      }
    } catch (error) {
      console.error("getProjectListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async updateProjectCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await updateProject(params);
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "更新成功",
          data: res.id,
        };
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: "该项目不存在",
        };
      }
    } catch (error) {
      console.error("updateProjectCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async deleteProjectCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await deleteProject(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: params.id,
      };
    } catch (error) {
      console.error("deleteProjectCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 连接服务器
  async connectServer(params) {
    try {
      const { serverPort, serverHost, serverUsername, serverKey } = params
      // 连接到服务器
      return await ssh.connect({
        host: serverHost,
        port: serverPort,
        username: serverUsername,
        password: serverKey,
        tryKeyboard: true
      });
    } catch (err) { }
  }

  async getServerInfoToConnectServer(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const serverInfo = await getDeployServerInfo(params);
        const { serverHost, serverPort, serverUsername, serverKey } = serverInfo;
        const res = await deployController.connectServer({
          serverHost: serverHost,
          serverPort: serverPort,
          serverUsername: serverUsername,
          serverKey: serverKey && decryptCode(serverKey)
        });
        if (res) {
          resolve(serverInfo);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("getServerInfoToConnectServer", error);
      }
    })
  }

  // 校验服务器文件是否存在
  async checkFileExistence(filePath) {
    try {
      return await ssh.execCommand(`ls ${filePath}`);
    } catch (error) {
      console.error('Error checking file existence:', error);
    }
  };

  // 获取服务器 nginx 配置
  async onReadNginxConfig(nginxRemoteFilePath) {
    try {
      const result = await ssh.execCommand(`cat ${nginxRemoteFilePath}`);
      const nginxConfigContent = result.stdout;
      return nginxConfigContent || '';
    } catch (err) {
      console.error('Error reading nginx config:', err);
    }
  };

  // 备份远程 nginx 配置
  async onBackupNginxConfig(remoteFilePath, ctx) {
    const backupPath = remoteFilePath.replace('nginx.conf', 'nginx_copy.conf');
    try {
      // 备份远程文件
      const res = await ssh.execCommand(`cp ${remoteFilePath} ${backupPath}`);
      return res;
    } catch (error) {
      console.error("backup nginx config error:", error);
      return false;
    }
  };

  // 校验 nginx 文件是否有效
  async onCheckNginxConfig(nginxRemoteFilePath, nginxRestartPath) {
    try {
      const res = await ssh.execCommand(
        `cd ${nginxRestartPath} && ./nginx -t -c ${nginxRemoteFilePath}`
      );
      return res;
    } catch (error) {
      console.error("check nginx config error:", error);
    }
  };

  // 重启 nginx 服务
  async onRestartNginx(nginxRestartPath) {
    try {
      const res = await ssh.execCommand(`cd ${nginxRestartPath} && ./nginx -s reload`);
      return res;
    } catch (error) {
      console.error("restart nginx error:", error);
    }
  };

  // 删除服务器文件
  async onRemoveServerFile(filePath) {
    try {
      return await ssh.execCommand(`rm -rf ${filePath}`);
    } catch (error) {
      console.error("remove server file error:", error);
    }
  };

  // 拉取服务器 nginx 配置
  async pullNginxConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const res = await deployController.checkFileExistence(serverInfo.nginxRemoteFilePath);
      if (res.code !== 0) {
        ctx.body = {
          code: 200,
          success: false,
          message: `${serverInfo.nginxRemoteFilePath} 文件不存在`,
        }
        return;
      }
      const nginxConfigContent = await deployController.onReadNginxConfig(serverInfo.nginxRemoteFilePath);

      if (nginxConfigContent) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取 nginx 配置成功",
          data: encryptRichText(nginxConfigContent),
        }
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: `未获取到 ${serverInfo.nginxRemoteFilePath} 中的文件内容`,
          data: null,
        }
      }
    } catch (error) {
      console.error("pullNginxConfigCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  }

  // 发布 nginx 配置
  async pushNginxConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      // 备份远程 nginx 配置
      const backupRes = await deployController.onBackupNginxConfig(serverInfo.nginxRemoteFilePath);
      if (backupRes.code !== 0) {
        ctx.body = {
          code: 200,
          success: false,
          message: backupRes.stderr,
        }
        return;
      }
      // 校验 nginx 配置是否正确
      const checkRes = await deployController.onCheckNginxConfig(serverInfo.nginxRemoteFilePath, serverInfo.nginxRestartPath);
      if (checkRes.code !== 0 || !checkRes.stderr.includes('test is successful')) {
        ctx.body = {
          code: 200,
          success: false,
          message: checkRes.stderr,
        }
        return;
      }
      if (params.content) {
        const command = `cat << 'EOF' > ${serverInfo.nginxRemoteFilePath}\n${decryptRichText(params.content)}\nEOF`;
        const res = await ssh.execCommand(command);
        if (res.code === 0) {
          // 重启 nginx 服务
          const restartRes = await deployController.onRestartNginx(serverInfo.nginxRestartPath);
          if (restartRes.code === 0) {
            // 删除服务器文件
            const copyPath = serverInfo.nginxRemoteFilePath.replace('nginx.conf', 'nginx_copy.conf');
            const removeRes = await deployController.onRemoveServerFile(copyPath);
            if (removeRes.code === 0) {
              ctx.body = {
                code: 200,
                success: true,
                message: "部署并重启 nginx 成功",
              }
              return;
            } else {
              ctx.body = {
                code: 200,
                success: false,
                message: `删除 nginx_copy.conf 文件失败: ${removeRes.stderr}`,
              }
              return;
            }
          } else {
            ctx.body = {
              code: 200,
              success: false,
              message: `重启 nginx 服务失败: ${res.stderr}`,
            }
            return;
          }
        } else {
          ctx.body = {
            code: 200,
            success: false,
            message: `发布 nginx 配置失败: ${res.stderr}`,
          }
        }
      }
    } catch (error) {
      console.error("pushNginxConfigCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  };

  // 重启 nginx 服务
  async restartNginxServiceCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const res = await deployController.onRestartNginx(serverInfo.nginxRestartPath);
      if (res.code === 0) {
        ctx.body = {
          code: 200,
          success: true,
          message: "nginx 服务重启成功",
        }
      } else {
        ctx.body = {
          code: 200,
          success: false,
          message: `重启 nginx 服务失败: ${res.stderr}`,
        }
      }
    } catch (error) {
      console.error("restartNginxServiceCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  };

  // 重启 node 服务
  async restartServerCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      await ssh.execCommand('pm2 restart 0');
      ctx.body = {
        code: 200,
        success: true,
        message: 'node 服务重启成功',
      }
    } catch (error) {
      ctx.body = {
        code: 200,
        success: true,
        message: '服务重启中，请稍等...',
        data: error
      }
    } finally {
      ssh.dispose();
    }
  };

  async getNodeServerInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const { code, stdout, stderr } = await ssh.execCommand(`pm2 info 0`);
      if (code === 0) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取服务信息成功",
          data: stdout,
        }
      } else {
        ctx.body = {
          code: 200,
          success: false,
          message: `获取服务信息失败: ${stderr}`,
        }
      }
    } catch (error) {
      console.error("getNodeServerInfoCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  }

  // 获取服务器日志
  async getServerLogCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const logPath = params.logType === 'error' ? serverInfo.remoteErrorLogFilePath : serverInfo.remoteLogFilePath;
      const res = await deployController.checkFileExistence(logPath);
      if (res.code !== 0) {
        ctx.body = {
          code: 200,
          success: false,
          message: `${logPath} 文件不存在`,
        }
        return;
      }
      const { code, stdout, stderr } = await ssh.execCommand(`cat ${logPath}`);
      if (code === 0) {
        ctx.body = {
          code: 200,
          success: true,
          message: '获取服务器日志成功',
          data: stdout
        }
      } else {
        ctx.body = {
          code: 200,
          success: false,
          message: `获取服务器日志失败: ${stderr}`,
        }
      }
    } catch (error) {
      console.error("getServerLogCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  }

  // 清除日志
  async clearServerLogCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const res = await ssh.execCommand('pm2 flush');
      if (res.code === 0) {
        ctx.body = {
          code: 200,
          success: true,
          message: '清除日志成功',
        }
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: `清除日志失败: ${res.stderr}`,
        }
      }
    } catch (error) {
      console.error("clearServerLogCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  }

  // 校验文件
  onVerifyFile(localFilePath, isServer) {
    if (!isServer && !verifyFolder(`${ompatiblePath(localFilePath, 'dist')}`)) {
      return {
        code: 1,
        stderr: `本地 ${ompatiblePath(localFilePath, 'dist')} 文件不存在，请先将项目进行打包后再发布`
      }
    }
    if (isServer && (!verifyFolder(`${localFilePath}/src`) || !verifyFile(`${localFilePath}/package.json`))) {
      return {
        code: 1,
        stderr: `本地 ${ompatiblePath(localFilePath, 'src')} 或 package.json 等文件不存在，无法发布`
      }
    }
  };

  // 解压文件
  async onUnzipZip(remotePath, zipName) {
    try {
      return await ssh.execCommand(`unzip -o ${`${remotePath}/${zipName}`} -d ${remotePath}`);
    } catch (err) {
      console.log("unzip error:", err)
    }
  };

  // 服务器安装依赖
  async onInstall(remotePath) {
    try {
      return await ssh.execCommand(`cd ${remotePath} && yarn install`);
    } catch (error) {
      console.error("install error:", error);
    }
  };

  // 拷贝文件
  async onCopyFile(localFilePath, remoteFilePath) {
    try {
      return await ssh.execCommand(`scp ${localFilePath} ${remoteFilePath}`);
    } catch (err) {
      console.error("copy file error:", err);
    }
  };

  // 发布项目
  async publishProjectCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const serverInfo = await deployController.getServerInfoToConnectServer(params);
      if (!serverInfo) {
        ctx.body = {
          code: 200,
          success: false,
          message: '请检查服务器配置信息是否正确',
        }
        return;
      }
      const zipName = `__FILE__${params.projectName}_dist.zip`
      const zipPath = ompatiblePath(`${serverInfo.serviceRemoveFilePath}/src/upload/files/${zipName}`)
      // 校验 clone 的项目中是否有dist文件夹
      if (!verifyFile(zipPath)) {
        ctx.body = {
          code: 200,
          success: false,
          message: `文件系统中不存在 ${zipPath} 文件，请检查项目是否正确`,
        }
        return;
      }

      // 拷贝/usr/local/server/src/upload/files/__FILE__projectName_dist.zip到nginx/html/dist.zip
      const copyRes = await deployController.onCopyFile(zipPath, params.projectRemoteFilePath);
      if (copyRes.code !== 0) {
        ctx.body = {
          code: 200,
          success: false,
          message: `拷贝文件失败: ${copyRes.stderr}`,
        }
        return;
      }
      console.log(`拷贝文件: ${zipPath} 成功`)

      // 删除 nginx 项目下的 dist 文件
      if (verifyFolder(ompatiblePath(params.projectRemoteFilePath, 'dist'))) {
        const removeRes = await deployController.onRemoveServerFile(`${params.projectRemoteFilePath}/dist`);
        if (removeRes.code !== 0) {
          ctx.body = {
            code: 200,
            success: false,
            message: `删除 ${params.projectRemoteFilePath}/dist 文件失败: ${removeRes.stderr}`,
          }
          return;
        }
        console.log(`删除 ${params.projectRemoteFilePath}/dist 文件成功`)
      }

      // 解压 nginx/html(nginx项目存放路径)/dist.zip
      const unzipRes = await deployController.onUnzipZip(params.projectRemoteFilePath, zipName);
      if (unzipRes.code !== 0) {
        ctx.body = {
          code: 200,
          success: false,
          message: `解压 ${params.projectRemoteFilePath}/${zipName} 文件失败: ${unzipRes.stderr}`,
        }
        return;
      }
      console.log(`解压 ${params.projectRemoteFilePath}/${zipName} 文件成功`)

      // 删除 nginx 项目下的 dist.zip 文件
      if (verifyFile(ompatiblePath(params.projectRemoteFilePath, zipName))) {
        const removeZipRes = await deployController.onRemoveServerFile(`${params.projectRemoteFilePath}/${zipName}`);
        if (removeZipRes.code !== 0) {
          ctx.body = {
            code: 200,
            success: false,
            message: `删除 ${params.projectRemoteFilePath}/${zipName} 文件失败: ${removeZipRes.stderr}`,
          }
          return;
        }
        console.log(`删除 ${params.projectRemoteFilePath}/${zipName} 文件成功`)
      }

      // 删除 /usr/local/server/src/upload/files/__FILE__projectName_dist.zip 文件夹
      if (verifyFile(zipPath)) {
        const removeDownloadRes = await deployController.onRemoveServerFile(zipPath);
        if (removeDownloadRes.code !== 0) {
          ctx.body = {
            code: 200,
            success: false,
            message: `删除 ${zipPath} 文件失败: ${removeDownloadRes.stderr}`,
          }
          return;
        }
        console.log(`删除 ${zipPath} 文件成功`)
      }

      if (params.isServer && params.install) {
        const { code, stdout, stderr } = await deployController.onInstall(serverInfo.serviceRemoveFilePath);
        if (code !== 0) {
          ctx.body = {
            code: 200,
            success: false,
            message: `安装依赖失败: ${stderr}`,
          }
          return;
        }
        console.log(`依赖安装成功: ${stdout}`)
      }

      if (params.isServer) {
        await ssh.execCommand('pm2 restart 0');
        ctx.body = {
          code: 200,
          success: true,
          message: '✨ 🎉 🎉 部署成功 🎉 🎉 ✨',
        }
        return;
      }


      ctx.body = {
        code: 200,
        success: true,
        message: '✨ 🎉 🎉 部署成功 🎉 🎉 ✨',
      }
    } catch (error) {
      console.error("publishProjectCtr", error);
      ctx.app.emit("error", {
        ...databaseError,
        data: error
      }, ctx);
    } finally {
      ssh.dispose();
    }
  }
};

const deployController = new DeployController();

module.exports = deployController;
