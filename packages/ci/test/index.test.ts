import { describe, expect, it, vi } from 'vitest';
// import { describe, expect, it, vi } from 'vitest';
import { publish } from '../src/publish';
import { onRestartServer } from '../src/utils';

describe('core publish', () => {
  it('should test publish', () => {
    expect(publish);
  });
});

describe('core restart', () => {
  it('restartScript 为空时应兜底 pm2 restart 0', async () => {
    const execCommand = vi.fn(async (cmd: string) => {
      if (cmd === 'pm2 list') return { code: 0, stdout: 'ok', stderr: '' };
      return { code: 0, stdout: '', stderr: '' };
    });

    const ssh = { execCommand } as any;

    await onRestartServer('/test/path', ssh, '');
    expect(execCommand).toHaveBeenNthCalledWith(1, 'pm2 restart 0');
    expect(execCommand).toHaveBeenNthCalledWith(2, 'pm2 list');
  });

  it('restartScript 有值时应执行传入命令', async () => {
    const execCommand = vi.fn(async (cmd: string) => {
      if (cmd === 'pm2 list') return { code: 0, stdout: 'ok', stderr: '' };
      return { code: 0, stdout: '', stderr: '' };
    });

    const ssh = { execCommand } as any;
    const restartScript = 'pm2 restart server';

    await onRestartServer('/test/path', ssh, restartScript);
    expect(execCommand).toHaveBeenNthCalledWith(1, restartScript);
    expect(execCommand).toHaveBeenNthCalledWith(2, 'pm2 list');
  });
});

// describe('publish', () => {
//   it('should call onVerifyFile if localPath and isServer are provided', async () => {
//     const onVerifyFileMock = vi.fn();
//     vi.mock('./path-to-your-publish-module', () => ({
//       onVerifyFile: onVerifyFileMock,
//       getPublishConfig: vi.fn(),
//       getPublishConfigInfo: vi.fn(),
//       onPublish: vi.fn(),
//       prompts: vi.fn().mockResolvedValue({
//         host: 'localhost',
//         port: '8080',
//         username: 'user',
//         password: 'pass',
//         localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
//         remoteFilePath: '/usr/local/nginx/html_admin',
//         install: false,
//         isServer: false
//       })
//     }));

//     const options = {
//       host: 'localhost',
//       port: '8080',
//       username: 'user',
//       password: 'pass',
//       localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
//       remoteFilePath: '/usr/local/nginx/html_admin',
//       install: false,
//       isServer: false
//     };

//     await publish('blogAdminWeb', options);

//     expect(onVerifyFileMock).toHaveBeenCalledWith('/Users/dnhyxc/Documents/code/blog-admin-web', true);
//   }, 100000);

//   // it('should handle missing options gracefully', async () => {
//   //   const onVerifyFileMock = vi.fn();
//   //   vi.mock('./path-to-your-publish-module', () => ({
//   //     onVerifyFile: onVerifyFileMock,
//   //     getPublishConfig: vi.fn(),
//   //     getPublishConfigInfo: vi.fn(),
//   //     onPublish: vi.fn(),
//   //     prompts: vi.fn().mockResolvedValue({
//   //       host: 'localhost',
//   //       port: '8080',
//   //       username: 'user',
//   //       password: 'pass',
//   //       localFilePath: '/path/to/local',
//   //       remoteFilePath: '/path/to/remote',
//   //       install: false,
//   //       isServer: true
//   //     })
//   //   }));

//   //   const options: Partial<Options> = {};

//   //   await publish('projectName', options as Options);

//   //   expect(onVerifyFileMock).not.toHaveBeenCalled();
//   // });
// });
