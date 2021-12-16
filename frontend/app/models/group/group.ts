import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty group model.
 */
export const GroupModel = types.model("Group").props({
  id: types.identifierNumber,
  name: types.string,
  groupType: types.maybe(types.string),
  startName: types.maybe(types.string),
  destinationName: types.maybeNull(types.string),
  meetingTime: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  pictureUrl: types.maybeNull(types.string),
  usersCount: types.maybeNull(types.number),
})

type GroupType = Instance<typeof GroupModel>
export interface Group extends GroupType {}
type GroupSnapshotType = SnapshotOut<typeof GroupModel>
export interface GroupSnapshot extends GroupSnapshotType {}
export const createGroupDefaultModel = () => types.optional(GroupModel, {})
