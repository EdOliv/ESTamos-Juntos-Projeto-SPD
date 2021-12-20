import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { GiftedChat } from "react-native-gifted-chat"
import { TwilioService } from "../../services/chat"
import { TabNavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const MESSAGE_CONTAINER: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const GroupChatScreen: FC<StackScreenProps<TabNavigatorParamList, "group_chat">> = observer(
  ({ route }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { channelId, identity } = route.params
    const [messages, setMessages] = useState([])
    const chatClientChannel = useRef()
    const chatMessagesPaginator = useRef()

    const setChannelEvents = useCallback((channel) => {
      chatClientChannel.current = channel
      chatClientChannel.current.on("messageAdded", (message) => {
        const newMessage = TwilioService.getInstance().parseMessage(message)
        const { giftedId } = message.attributes
        if (giftedId) {
          setMessages((prevMessages) =>
            prevMessages.map((m) => (m._id === giftedId ? newMessage : m)),
          )
        } else {
          setMessages((prevMessages) => [newMessage, ...prevMessages])
        }
      })
      return chatClientChannel.current
    }, [])

    useEffect(() => {
      TwilioService.getInstance()
        .getChatClient()
        .then((client) => client.getChannelBySid(channelId))
        .then((channel) => setChannelEvents(channel))
        .then((currentChannel) => currentChannel.getMessages())
        .then((paginator) => {
          chatMessagesPaginator.current = paginator
          const newMessages = TwilioService.getInstance().parseMessages(paginator.items)
          setMessages(newMessages)
        })
        .catch((err) => console.log({ message: err.message, type: "danger" }))
    }, [channelId, setChannelEvents])

    const onSend = useCallback((newMessages = []) => {
      const attributes = { giftedId: newMessages[0]._id }
      setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))
      chatClientChannel.current?.sendMessage(newMessages[0].text, attributes)
    }, [])

    return (
      <Screen style={ROOT} preset="scroll">
        <GiftedChat
          messagesContainerStyle={MESSAGE_CONTAINER}
          messages={messages}
          renderAvatarOnTop
          onSend={(messages) => onSend(messages)}
          user={{ _id: identity }}
        />
      </Screen>
    )
  },
)
