import { UserGroupModel } from "./user-group"

test("can be created", () => {
  const instance = UserGroupModel.create({
    userId: 1,
    groupId: 1,
  })

  expect(instance).toBeTruthy()
})
