import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { AuthStoreModel } from "../auth-store/auth-store"
import { UserStoreModel } from "../user-store/user-store"
import { GroupStoreModel } from "../group-store/group-store"
import { ChatStoreModel } from "../chat-store/chat-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  authStore: types.optional(AuthStoreModel, {} as any),
  userStore: types.optional(UserStoreModel, {} as any),
  groupStore: types.optional(GroupStoreModel, {} as any),
  chatStore: types.optional(ChatStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
