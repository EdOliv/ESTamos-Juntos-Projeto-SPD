import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthApi } from "../../services/api/auth-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty auths
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    accessToken: types.optional(types.string, ""),
    refreshToken: types.optional(types.string, ""),
    isAuthenticated: types.boolean.create(false),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveAuthData: (
      accessTokenSnapShot: string,
      refreshTokenSnapShot: string,
      isAuthenticated: boolean,
    ) => {
      self.accessToken = accessTokenSnapShot
      self.refreshToken = refreshTokenSnapShot
      self.isAuthenticated = isAuthenticated
    },
  }))
  .actions((self) => ({
    login: async (email: string, password: string) => {
      const authApi = new AuthApi(self.environment.api)
      const result = await authApi.login(email, password)

      if (result.kind === "ok") {
        self.saveAuthData(result.accessToken, result.refreshToken, true)
        self.saveAuthData("", "", false)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
    signUp: async (username: string, email: string, password: string) => {
      const authApi = new AuthApi(self.environment.api)
      const result = await authApi.signUp(username, email, password)

      if (result.kind === "ok") {
        self.saveAuthData(result.accessToken, result.refreshToken, true)
      } else {
        self.saveAuthData("", "", false)
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
