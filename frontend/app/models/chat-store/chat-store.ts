import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatApi } from "../../services/api/chat-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty chats
 */
export const ChatStoreModel = types
  .model("ChatStore")
  .extend(withEnvironment)
  .actions((self) => ({
    getChatToken: async (
      username: string
    ) => {
      const chatApi = new ChatApi(self.environment.api)
      const result = await chatApi.getChatToken(
        username
      )

      if (result.kind === "ok") {
        // self.saveChats(result.chat)
        return result;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    
  }))

type ChatStoreType = Instance<typeof ChatStoreModel>
export interface ChatStore extends ChatStoreType {}
type ChatStoreSnapshotType = SnapshotOut<typeof ChatStoreModel>
export interface ChatStoreSnapshot extends ChatStoreSnapshotType {}
export const createChatStoreDefaultModel = () => types.optional(ChatStoreModel, {})
