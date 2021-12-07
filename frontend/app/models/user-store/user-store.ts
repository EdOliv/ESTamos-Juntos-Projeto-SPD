import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserApi } from "../../services/api/user-api"
import { withEnvironment } from "../extensions/with-environment"
import { UserModel, UserSnapshot } from "../user/user"

/**
 * Example store containing Rick and Morty users
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    userData: types.maybeNull(UserModel)
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUserData: (
      userData: UserSnapshot
    ) => {
      self.userData = userData
    },
  }))
  .actions((self) => ({
    getAccountData: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getAccountData()

      if (result.kind === "ok") {
        self.saveUserData(result.userData)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
