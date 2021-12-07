import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty usergroup model.
 */
export const UserGroupModel = types.model("UserGroup").props({
  group: types.identifierNumber,
  groupId: types.identifierNumber,
  user: types.identifierNumber,
  userId: types.identifierNumber,
  joinDate: types.maybeNull(types.string),
  isAdmin: types.boolean.create(false),
})

type UserGroupType = Instance<typeof UserGroupModel>
export interface UserGroup extends UserGroupType {}
type UserGroupSnapshotType = SnapshotOut<typeof UserGroupModel>
export interface UserGroupSnapshot extends UserGroupSnapshotType {}
export const createUserGroupDefaultModel = () => types.optional(UserGroupModel, {})
