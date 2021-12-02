import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetLoginResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class AuthApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login(username: string, password: string): Promise<GetLoginResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "login", { username: username, password: password }
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const { access_token: accessToken , refresh_token: refreshToken } = response.data

      return { kind: "ok", accessToken, refreshToken }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
