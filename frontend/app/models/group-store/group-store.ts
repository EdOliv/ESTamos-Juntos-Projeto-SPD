import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GroupModel, GroupSnapshot } from "../group/group"
import { GroupApi } from "../../services/api/group-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty groups
 */
export const GroupStoreModel = types
  .model("GroupStore")
  .props({
    userGroups: types.optional(types.array(GroupModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveGroups: (groupSnapshots: GroupSnapshot[]) => {
      self.userGroups.replace(groupSnapshots)
    },
  }))
  .actions((self) => ({
    createGroup: async (
      name: string,
      groupType: string,
      startName: string,
      destinationName: string,
      meetingTime: string,
      description: string,
    ) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.createGroup(
        name,
        groupType,
        startName,
        destinationName,
        meetingTime,
        description,
      )

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.group;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    getUserGroups: async () => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.getUserGroups()

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.groups;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
  }))

type GroupStoreType = Instance<typeof GroupStoreModel>
export interface GroupStore extends GroupStoreType {}
type GroupStoreSnapshotType = SnapshotOut<typeof GroupStoreModel>
export interface GroupStoreSnapshot extends GroupStoreSnapshotType {}
export const createGroupStoreDefaultModel = () => types.optional(GroupStoreModel, {})
