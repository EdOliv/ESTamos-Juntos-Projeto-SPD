import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { Text, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { useStores } from "../../models"

const FULL: ViewStyle = {
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  flexDirection: "row",
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
}

const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 26,
  textAlign: "center",
  color: color.textButton,
  backgroundColor: color.button,
  paddingVertical: spacing[3],
  fontFamily: typography.bold,
}

const IMAGE: ImageStyle = {
  width: 80,
  height: 80,
  marginRight: spacing[5],
  marginLeft: spacing[3],
  borderRadius: 10,
}

const GROUP_EMPTY: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing[4],
  backgroundColor: color.background,
}

const GROUP_EMPTY_TEXT: TextStyle = {
  flexWrap: "wrap",
  textAlign: "center",
}

const GROUP_ITEM: ViewStyle = {
  alignSelf: "stretch",
  flexDirection: "row",
  marginTop: spacing[5],
  paddingBottom: spacing[5],
  borderBottomColor: color.primary,
  borderBottomWidth: 1,
}

const GROUP_NAME: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontFamily: typography.bold,
}

const GROUP_DESTINATION: TextStyle = {
  ...TEXT,
  fontSize: 14,
  marginTop: spacing[3],
}

const GROUP_FOOTER: ViewStyle = {
  ...TEXT,
  flexDirection: "row",
}

const GROUP_FOOTER_TEXT: TextStyle = {
  ...TEXT,
  marginTop: spacing[3],
  flex: 1,
  fontSize: 12,
}

const ADD_BUTTON: TextStyle = {
  alignSelf: "flex-end",
  paddingRight: spacing[2],
  marginBottom: spacing[1],
  position: "absolute",
  bottom: 0,
}

export const GroupsScreen: FC<StackScreenProps<TabNavigatorParamList, "groups">> = observer(
  ({ navigation }) => {
    const { groupStore } = useStores()

    const [groups, setGroups] = useState([])

    const defaultImage = require("../../../assets/images/crowd.png")

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", async () => {
        console.log("LOADING GROUPS")
        const loadGroups = async () => {
          const newGroups = await groupStore.getUserGroups()
          setGroups(newGroups)
        }
        loadGroups()
      })
      return unsubscribe
    }, [navigation])

    // Pull in navigation via hook
    return (
      <View testID="GroupScreen" style={FULL}>
        <Text style={TITLE} preset="header" text="Seus grupos" />

        {groups && groups.length > 0 ? (
          <ScrollView style={CONTAINER} horizontal={false} contentContainerStyle={FULL}>
            {groups.map((group) => (
              <TouchableOpacity
                style={GROUP_ITEM}
                key={group.id}
                onPress={() => {
                  navigation.navigate("group_details", { groupId: group.id })
                }}
              >
                <AutoImage
                  style={IMAGE}
                  source={
                    (group.image && { uri: group.image }) || defaultImage
                  }
                />
                <View style={FULL}>
                  <Text style={GROUP_NAME}>{group.name}</Text>
                  <Text style={GROUP_DESTINATION}>{group.destinationName}</Text>
                  <View style={GROUP_FOOTER}>
                    <Text style={GROUP_FOOTER_TEXT}>{group.meetingTime}</Text>
                    <Text style={GROUP_FOOTER_TEXT}>{group.usersCount} pessoas</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={GROUP_EMPTY}>
            <Text style={GROUP_EMPTY_TEXT}>
              Você não está participando de um grupo ainda. Por que não criar um agora?
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={ADD_BUTTON}
          onPress={() => {
            navigation.navigate("group_creation")
          }}
        >
          <Icons size={80} name="add-box" color={color.primary} />
        </TouchableOpacity>
      </View>
    )
  },
)
