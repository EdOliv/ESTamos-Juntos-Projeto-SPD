import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetAccountDataResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getAccountData(): Promise<GetAccountDataResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get("user/account")
      
      console.log(response.status)
      console.log(response.originalError)
      console.log(response.ok)
      console.log(response.data)
      console.log(1)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const { user_data: userData } = response.data

      return { kind: "ok", userData }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
