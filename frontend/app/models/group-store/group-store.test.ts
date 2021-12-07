import { GroupStoreModel } from "./group-store"

test("can be created", () => {
  const instance = GroupStoreModel.create({})

  expect(instance).toBeTruthy()
})
