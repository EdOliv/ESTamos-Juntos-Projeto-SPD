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
        return result;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    updateUser: async (
      name: string,
      username: string,
      email: string,
      password: string,
      image: any|null
    ) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.updateUser(
        name,
        username,
        email,
        password,
        image
      )

      if (result.kind === "ok") {
        return result.userData;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
