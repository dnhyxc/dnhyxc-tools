const WebSocket = require("ws");
const { parseQuery } = require("../utils");
const messageServer = require("../service/web/message.service");
const chatServer = require("../service/web/chat.service");
const contactServer = require("../service/web/contacts.service");
// const userServer = require("../service/web/user.service");

class WS {
  static online = 0; // 在线连接

  static ws = WebSocket.Server; //默认实例

  static init() {
    // 创建实例
    this.ws = new WebSocket.Server({ port: 9002, path: "/ws" });

    this.ws.on("connection", async (ws, request) => {
      if (!request.url.includes("/ws")) {
        return ws.close();
      }
      this.online = this.ws._server._connections;

      const query = parseQuery(request.url);
      if (!query.id) {
        return ws.close();
      }
      try {
        ws.id = query.id; // 添加ws实例的唯一标识
        const obj = {
          message: `连接成功${query.id}${this.online}`,
          code: 200,
        };
        ws.send(JSON.stringify(obj));
      } catch (error) {
        console.log("websocket connection error", error);
        return ws.close();
      }

      ws.on("message", async (msg) => {
        try {
          const messages = msg && JSON.parse(msg);
          if (messages.action === "push" || messages.action === "chat") {
            // 创建消息，保存到数据库
            messageServer.createMessage(messages);
            // 如果是聊天则不单独推送ws消息，由消息自己推送
            if (messages.action !== "chat") {
              this.sendMessage({
                ...messages,
                data: {
                  ...messages.data,
                  isReaded: false,
                },
                code: 200,
              });
            }
          }
          if (
            messages.action === "chat" &&
            messages.data.from !== messages.data.to
          ) {
            const res = await chatServer.addChat({
              ...messages.data,
              userId: messages.userId,
            });
            const findOne = res.find((i) => i.userId === messages.userId);
            const sendData = {
              ...messages,
              data: {
                ...messages.data,
                userId: messages.userId,
                id: findOne._id,
              },
              code: 200,
            };

            this.sendMessage(sendData);
            // 当发送消息的人不在接收消息的人的联系人列表中时，需要向接收消息的人的联系人列表中添加发送消息的人
            if (messages.data.to !== messages.userId) {
              await contactServer.addCatchContacts({
                contactId: messages.data.from,
                userId: messages.data.to,
                createTime: messages.data.createTime,
              });
            }
          }
        } catch (error) {
          console.error("websocket on message error", error);
          return ws.close();
        }
      });
    });
  }

  // 发送客户端数据
  static sendMessage(data) {
    // success 控制是否发送成功
    let success = false;
    if (!(this.ws instanceof WebSocket.Server)) {
      return success;
    }
    this.ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        success = true;
      }
    });
    return success;
  }

  // 单点发送消息
  static singleSendMessage(data) {
    // success 控制是否发送成功
    let success = false;
    if (!(this.ws instanceof WebSocket.Server)) {
      return success;
    }

    const clients = this.ws.clients.values();

    const clientList = Array.from(clients);

    if (clientList?.length) {
      Array.from(clientList).forEach((i) => {
        if (i.readyState === WebSocket.OPEN && i.id == data.userId) {
          i.send(JSON.stringify(data));
          success = true;
        }
      });
    }

    return success;

    // this.ws.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN && client.id === data.userId) {
    //     client.send(JSON.stringify(data));
    //     success = true;
    //   }
    // });

    // return success;
  }
}

module.exports = WS;
