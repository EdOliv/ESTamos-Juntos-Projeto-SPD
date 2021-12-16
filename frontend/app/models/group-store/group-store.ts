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
      image: any|null
    ) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.createGroup(
        name,
        groupType,
        startName,
        destinationName,
        meetingTime,
        description,
        image
      )

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.group;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    updateGroup: async (
      id: number,
      name: string,
      groupType: string,
      startName: string,
      destinationName: string,
      meetingTime: string,
      description: string,
      image: any|null
    ) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.updateGroup(
        id,
        name,
        groupType,
        startName,
        destinationName,
        meetingTime,
        description,
        image
      )

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.group;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    getGroupData: async (id: number) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.getGroupData(id)

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.group;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    searchGroups: async (name: string) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.searchGroups(name)

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.groups;
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
    getGroupUsers: async (id: number) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.getGroupUsers(id)

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result.usersGroup;
      } else {
        __DEV__ && console.tron.log(result.kind)
        return null;
      }
    },
    joinGroup: async (id: number) => {
      const groupApi = new GroupApi(self.environment.api)
      const result = await groupApi.joinGroup(id)

      if (result.kind === "ok") {
        // self.saveGroups(result.group)
        return result;
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
