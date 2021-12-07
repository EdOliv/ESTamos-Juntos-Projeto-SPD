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

import { Text, Icon, Button } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { useStores } from "../../models"
import { Group } from "../../models/group/group"

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
}

const GROUP_NAME: TextStyle = {
  color: color.text,
  fontSize: 22,
  fontFamily: typography.secondary,
  marginTop: spacing[1],
  paddingLeft: spacing[4],
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing[5],
}

const FIELD_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 15,
  marginTop: spacing[2],
}

const USER_IMAGE: ImageStyle = {
  width: 40,
  height: 40,
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
  fontSize: 15,
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
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.background,
}

export const DetailsScreen: FC<StackScreenProps<TabNavigatorParamList, "details">> = observer(
  ({ route, navigation }) => {
    // Pull in one of our MST stores
    const { authStore, groupStore } = useStores()

    const [group, setGroup] = useState<Group | null>({
      id: 0,
      name: "",
      groupType: "",
      startName: "",
      destinationName: "",
      meetingTime: "",
      description: "",
      usersCount: 0,
    })
    const [people, setPeople] = useState([])

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
      navigation.navigate("groups")
    }

    const editGroup = () => {
      navigation.navigate("groups")
    }

    const joinGroup = async () => {
      const res = await groupStore.joinGroup(route.params.groupId)
      if (res.kind === "ok") {
        Alert.alert("Você faz parte do grupo!")
        navigation.navigate("newgroup")
      } else {
        Alert.alert("Erro ao entrar no grupo!")
      }
    }

    const isUserAdmin = (id: number) => {
      return people.some((userGroup) => userGroup.user.id === id && userGroup.isAdmin)
    }

    return (
      <ScrollView testID="NewGroupScreen" style={FULL}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>

        <View style={CONTAINER}>
          <View style={HEADER}>
            <Icon icon="bug" style={GROUP_IMAGE} />
            <Text style={GROUP_NAME}>{group.name}</Text>
          </View>

          <Text style={FIELD_TITLE}>Tipo do grupo</Text>
          <Text style={FIELD_TEXT}>{group.groupType}</Text>

          <Text style={FIELD_TITLE}>Ponto de encontro</Text>
          <Text style={FIELD_TEXT}>{group.startName}</Text>

          <Text style={FIELD_TITLE}>Destino</Text>
          <Text style={FIELD_TEXT}>{group.destinationName}</Text>

          <Text style={FIELD_TITLE}>Horário de saída</Text>
          <Text style={FIELD_TEXT}>{group.meetingTime}</Text>

          <Text style={FIELD_TITLE}>Outros detalhes</Text>
          <Text style={FIELD_TEXT}>{group.description || "--"}</Text>

          <Text style={FIELD_TITLE}>Participantes</Text>

          {people.map((userGroup) => (
            <View key={userGroup.user.id} style={USER_ITEM}>
              <TouchableOpacity style={USER_SELECT}>
                <Icon icon="bug" style={USER_IMAGE} />
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
            {isUserAdmin(authStore.userId) && (
              <Button
                testID="next-screen-button"
                style={BUTTON_DELETE}
                textStyle={BUTTON_TEXT}
                text="EXCLUIR GRUPO"
                onPress={goBack}
              />
            )}
          </View>
        </View>
      </ScrollView>
    )
  },
)
