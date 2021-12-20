import { ChatStoreModel } from "./chat-store"

test("can be created", () => {
  const instance = ChatStoreModel.create({})

  expect(instance).toBeTruthy()
})
