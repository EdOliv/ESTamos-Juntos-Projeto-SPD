import { UserModel } from "./user"

test("can be created", () => {
  const instance = UserModel.create({
    id: 1,
    name: "Rick Sanchez",
  })

  expect(instance).toBeTruthy()
})
