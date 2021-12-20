import { Client, Message } from "twilio-chat"

export class TwilioService {
  static serviceInstance
  static chatClient: Client

  // create a single service instance
  static getInstance() : TwilioService {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService()
    }
    return TwilioService.serviceInstance
  }

  // use chat client if don't have instance, create a new chat client
  async getChatClient(twilioToken?) {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error("Twilio token is null or undefined")
    }
    if (!TwilioService.chatClient && twilioToken) {
      return Client.create(twilioToken).then((client) => {
        TwilioService.chatClient = client
        return TwilioService.chatClient
      })
    }
    return Promise.resolve().then(() => TwilioService.chatClient)
  }

  // manage our token expiration
  addTokenListener(getToken) {
    if (!TwilioService.chatClient) {
      throw new Error("Twilio client is null or undefined")
    }
    TwilioService.chatClient.on("tokenAboutToExpire", () => {
      getToken().then(TwilioService.chatClient.updateToken)
    })

    TwilioService.chatClient.on("tokenExpired", () => {
      getToken().then(TwilioService.chatClient.updateToken)
    })
    return TwilioService.chatClient
  }

  parseMessages(messages) {
    return messages.map(this.parseMessage).reverse();
  }

  parseMessage(message: Message) {
    const attributes = message.attributes as any;
    return {
      _id: message.sid,
      text: message.body,
      createdAt: message.dateCreated,
      user: {
        _id: message.author,
        name: message.author,
        avatar: attributes.avatar,
      },
      giftedId: attributes.giftedId,
      received: true,
    };
  }

  // gracefully shutting down library instance.
  clientShutdown() {
    TwilioService.chatClient?.shutdown()
    TwilioService.chatClient = null
  }
}
