import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty user model.
 */
export const UserModel = types.model("User").props({
  id: types.identifierNumber,
  name: types.maybe(types.string),
  email: types.maybe(types.string),
  username: types.maybe(types.string),
  profilePictureUrl: types.maybe(types.string),
  phone: types.maybe(types.string)
})

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
