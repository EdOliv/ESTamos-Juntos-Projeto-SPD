import { GroupModel } from "./group"

test("can be created", () => {
  const instance = GroupModel.create({
    id: 1,
    name: "Rick Sanchez",
  })

  expect(instance).toBeTruthy()
})
