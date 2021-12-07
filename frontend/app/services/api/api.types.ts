import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
import { User } from "../../models/user/user"
import { Group } from "../../models/group/group"

export type GetUsersResult = { kind: "ok"; groups: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; group: User } | GeneralApiProblem

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

export type GetLoginResult =
  | { kind: "ok"; accessToken: string; refreshToken: string }
  | GeneralApiProblem
export type GetSignUpResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem

export type GetAccountDataResult =
  | {
      kind: "ok"
      userData: User
    }
  | GeneralApiProblem

export type CreateGroupResult = { kind: "ok"; group: Group } | GeneralApiProblem
export type GetGroupsResult = { kind: "ok"; groups: Group[] } | GeneralApiProblem
