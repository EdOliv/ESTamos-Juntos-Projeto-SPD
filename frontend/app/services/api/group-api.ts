import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { CreateGroupResult, GetGroupsResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class GroupApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async createGroup(
    name: string,
    groupType: string,
    startName: string,
    destinationName: string,
    meetingTime: string,
    description: string,
  ): Promise<CreateGroupResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post("group/", {
        name,
        group_type: groupType,
        start_name: startName,
        destination_name: destinationName,
        meeting_time: meetingTime,
        description: description,
      })

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const group = {
        id: response.data.group.id,
        name: response.data.group.name,
        groupType: response.data.group.group_type,
        startName: response.data.group.start_name,
        destinationName: response.data.group.destination_name,
        meetingTime: response.data.group.meeting_time,
        description: response.data.group.description,
      }

      return { kind: "ok", group }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async searchGroups(name: string): Promise<GetGroupsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get("group/", {
        params: {
          name,
        },
      })

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const groups = response.data.groups.map((group) => {
        return {
          id: group.id,
          name: group.name,
          startName: group.start_name,
          destinationName: group.destination_name,
          meetingTime: group.meeting_time,
          usersCount: group.users_count,
        }
      })

      return { kind: "ok", groups }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getUserGroups(): Promise<GetGroupsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get("group/my_groups")

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const groups = response.data.groups.map((group) => {
        return {
          id: group.id,
          name: group.name,
          startName: group.start_name,
          destinationName: group.destination_name,
          meetingTime: group.meeting_time,
          usersCount: group.users_count,
        }
      })

      return { kind: "ok", groups }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
