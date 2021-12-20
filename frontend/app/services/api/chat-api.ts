import { ApiResponse } from "apisauce"
import { Api } from "./api"
import {
  GetChatTokenResult
} from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class ChatApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getChatToken(
    username: string
  ): Promise<GetChatTokenResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`chat/token/${username}`)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", token: response.data.token }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}