import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  ImageStyle,
  Alert,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { MaterialIcons as Icons } from "@expo/vector-icons"

import { Text, Button, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { Group } from "../../models/group/group"
import { TwilioService } from "../../services/chat"


const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: "stretch",
}

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignContent: "stretch",
  paddingBottom: spacing[6],
}

const TEXT: TextStyle = {
  color: color.text,
  fontFamily: typography.primary,
}

const HEADER: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  alignItems: "center",
  justifyContent: "center",
}

const GROUP_IMAGE: ImageStyle = {
  width: 100,
  height: 100,
  alignSelf: "center",
  borderRadius: 10,
}

const GROUP_NAME: TextStyle = {
  color: color.text,
  fontSize: 20,
  marginTop: spacing[1],
  paddingLeft: spacing[4],
  fontFamily: typography.bold,
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[5],
  fontFamily: typography.bold,
}

const FIELD_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  marginTop: spacing[2],
}

const USER_IMAGE: ImageStyle = {
  width: 48,
  height: 48,
  borderRadius: spacing[5],
  alignSelf: "center",
}

const USER_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  alignItems: "center",
  justifyContent: "space-between",
}

const USER_SELECT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const USER_NAME: TextStyle = {
  color: color.text,
  fontSize: 14,
  paddingLeft: spacing[3],
}

const BUTTON_EDIT: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginTop: spacing[5],
}

const BUTTON_DELETE: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.error,
  marginVertical: spacing[3],
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.background,
}


export const GroupDetailsScreen: FC<StackScreenProps<
  TabNavigatorParamList, "group_details">> = observer(({ route, navigation }) => {

  const { authStore, userStore, groupStore } = useStores()

  const userId = userStore.userData ? userStore.userData.id : 0;
  const username = userStore.userData ? userStore.userData.username : "--";

  const [group, setGroup] = useState<Group | null>({
    id: 0,
    name: "",
    groupType: "",
    startName: "",
    destinationName: "",
    meetingTime: "",
    description: "",
    pictureUrl: null,
    usersCount: 0,
  })
  const [people, setPeople] = useState([])

  const defaultGroupImage = require("../../../assets/images/crowd.png")
  const defaultUserImage = require("../../../assets/images/user.png")

  useEffect(() => {
    const loadGroup = async () => {
      const newGroup = await groupStore.getGroupData(route.params.groupId)
      setGroup(newGroup)
      const newPeople = await groupStore.getGroupUsers(route.params.groupId)
      console.log(newPeople)

      setPeople(newPeople)
    }
    loadGroup()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  const openChat = (groupId: number) => {
    navigation.navigate("group_chat", { channelId: groupId, identity: username })
  }

  const ownProfile = () => {
    navigation.navigate("profile")
  }

  const otherProfile = (name: string) => {
    navigation.navigate("profile_others", { groupUserName: name })
  }

  const deleteGroup = () => {
    navigation.navigate("groups")
  }

  const editGroup = () => {
    navigation.navigate("group_edit", { groupId: group.id })
  }

  const joinGroup = async () => {
    const res = await groupStore.joinGroup(route.params.groupId)
    
    const groupId = route.params.groupId.toString();
    TwilioService.getInstance()
      .getChatClient()
      .then((client) =>
        client
          .getChannelByUniqueName(groupId)
          .then((channel) => (channel.status !== 'joined' ? channel.join() : channel))
      )
      .then(() => console.log({ message: 'You have joined.' }))
      .catch((err) => console.log({ message: err.message, type: 'danger' }))
    if (res.kind === "ok") {
      Alert.alert("Você faz parte do grupo!")
      navigation.navigate("groups")
    } else {
      Alert.alert("Erro ao entrar no grupo!")
    }
  }

  const leaveGroup = async () => {
    const res = await groupStore.leaveGroup(route.params.groupId, userId)
    
    const groupId = route.params.groupId.toString();
    TwilioService.getInstance()
      .getChatClient()
      .then((client) =>
        client
          .getChannelByUniqueName(groupId)
          .then((channel) => (channel.status === 'joined' ? channel.leave() : channel))
      )
      .then(() => console.log({ message: 'You have left.' }))
      .catch((err) => console.log({ message: err.message, type: 'danger' }))
    if (res.kind === "ok") {
      Alert.alert("Você saiu do grupo!")
      navigation.navigate("groups")
    } else {
      Alert.alert("Erro ao sair do grupo!")
    }
  }

  const isUserAdmin = (id: number) => {
    return people.some((userGroup) => userGroup.user.id === id && userGroup.isAdmin)
  }

  return (
    <ScrollView testID="GroupDetailsScreen" style={FULL}>
      <TouchableOpacity onPress={goBack}>
        <Icons size={35} name="keyboard-return" color={color.primary} />
      </TouchableOpacity>

      <View style={CONTAINER}>
        <View style={HEADER}>
          <AutoImage
            style={GROUP_IMAGE}
            source={(group.pictureUrl && { uri: group.pictureUrl }) || defaultGroupImage}
          />
          <Text style={GROUP_NAME}>{group.name}</Text>
        </View>

        <Text style={FIELD_TITLE}>Tipo do grupo</Text>
        <Text style={FIELD_TEXT}>{group.groupType}</Text>

        <Text style={FIELD_TITLE}>Ponto de encontro</Text>
        <Text style={FIELD_TEXT}>{group.startName}</Text>

        <Text style={FIELD_TITLE}>Destino</Text>
        <Text style={FIELD_TEXT}>{group.destinationName}</Text>

        <Text style={FIELD_TITLE}>Horário de saída</Text>
        <Text style={FIELD_TEXT}>{group.meetingTime.substring(0, 5)}</Text>

        <Text style={FIELD_TITLE}>Outros detalhes</Text>
        <Text style={FIELD_TEXT}>{group.description || "--"}</Text>
        
        <Button
          testID="next-screen-button"
          style={BUTTON_EDIT}
          textStyle={BUTTON_TEXT}
          text="MENSAGENS"
          onPress={() => openChat(group.id)}
        />

        <Text style={FIELD_TITLE}>Pessoas</Text>

        {people.map((userGroup) => (
          <View key={userGroup.user.id} style={USER_ITEM}>
            <TouchableOpacity
              style={USER_SELECT}
              onPress={
                authStore.userId === userGroup.user.id
                  ? ownProfile
                  : () => otherProfile(userGroup.user.username)
              }
            >
              <AutoImage
                style={USER_IMAGE}
                source={
                  (userGroup.user.profilePictureUrl && { uri: userGroup.user.profilePictureUrl }) ||
                  defaultUserImage
                }
              />
              <Text style={USER_NAME}>{userGroup.user.username}</Text>
            </TouchableOpacity>

            {userGroup.isAdmin ? (
              <Icons size={30} name="vpn-key" color={color.palette.gold} />
            ) : (
              <TouchableOpacity>
                <Icons size={30} name="clear" color={color.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={FOOTER_CONTENT}>
          {isUserAdmin(authStore.userId) ? (
            <Button
              testID="next-screen-button"
              style={BUTTON_EDIT}
              textStyle={BUTTON_TEXT}
              text="EDITAR GRUPO"
              onPress={editGroup}
            />
          ) : (
            <Button
              testID="next-screen-button"
              style={BUTTON_EDIT}
              textStyle={BUTTON_TEXT}
              text="ENTRAR NO GRUPO"
              onPress={joinGroup}
            />
          )}
          {isUserAdmin(authStore.userId) ? (
            <Button
              testID="next-screen-button"
              style={BUTTON_DELETE}
              textStyle={BUTTON_TEXT}
              text="EXCLUIR GRUPO"
              onPress={deleteGroup}
            />
          ) : (
            <Button
              testID="next-screen-button"
              style={BUTTON_DELETE}
              textStyle={BUTTON_TEXT}
              text="SAIR DO GRUPO"
              onPress={leaveGroup}
            />
          )}
        </View>
        
      </View>
    </ScrollView>
  )
})
