import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import jwtDecode from "jwt-decode";
import { loadString, saveString } from "../../utils/storage";
import { navigate } from "../../navigators";

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    this.apisauce.addAsyncRequestTransform(request => async () => {
      console.log(request.url)
      if (
        request.url &&
        !request.url.endsWith("login") &&
        !request.url.endsWith("refresh") &&
        !request.url.endsWith("sign_up")
      ) {
        const accessToken = await loadString("@ESTamosJuntos:accessToken");
        if (!accessToken) {
          navigate("login", {});
        }
  
        const decoded: any = jwtDecode(accessToken);
        const userTokenExpiration = new Date(decoded.exp * 1000 || 0);
        const today = new Date();
        if (today > userTokenExpiration) {
          // refresh the token here
          const userRefreshToken = await loadString(
            "@ESTamosJuntos:refreshToken"
          );
          this.apisauce
            .post("/refresh", null, {
              headers: {
                Authorization: "Bearer " + userRefreshToken,
              },
            })
            .then(async (response: any) => {
              const newAccessToken = response.data.access_token;
              await saveString("@ESTamosJuntos:accessToken", newAccessToken)
              request.headers.Authorization = `Bearer ${newAccessToken}`;
            })
            .catch(() => {
              navigate("login", {});
            });
        } else {
          request.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    })
  }

  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: any = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: any = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
