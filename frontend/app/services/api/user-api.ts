import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetAccountDataResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async updateUser(
    name: string,
    username: string,
    email: string,
    password: string,
    image: any|null
    ): Promise<GetAccountDataResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.put("user/update", {
        name,
        username,
        email,
        password,
        image
      })

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      console.log(response.data)

      const userData = {
        id: response.data.user_data.id,
        name: response.data.user_data.name,
        email: response.data.user_data.email,
        username: response.data.user_data.username,
        phone: response.data.user_data.phone,
        profilePictureUrl: response.data.user_data.profile_picture_url,
      }

      return { kind: "ok", userData }
    } catch (e) {
      console.log(e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getAccountData(): Promise<GetAccountDataResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get("user/account")

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const userData = {
        id: response.data.user_data.id,
        name: response.data.user_data.name,
        email: response.data.user_data.email,
        username: response.data.user_data.username,
        phone: response.data.user_data.phone,
        profilePictureUrl: response.data.user_data.profile_picture_url,
      }

      return { kind: "ok", userData }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
