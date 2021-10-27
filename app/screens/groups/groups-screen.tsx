import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, SafeAreaView, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { Button, Screen, Text, GradientBackground, Icon } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[6],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginTop: spacing[3],
}
const GROUP_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[5],
  paddingBottom: spacing[5],
  borderBottomColor: color.palette.lightGrey,
  borderBottomWidth: 1,
}
const GROUP_NAME: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 20,
  lineHeight: 30,
}
const GROUP_DESTINATION: TextStyle = {
  ...CONTENT,
}
const GROUP_FOOTER: ViewStyle = {
  flexDirection: "row",
}
const GROUP_FOOTER_TEXT: ViewStyle = {
  ...CONTENT,
  flex: 1,
}
const IMAGE: ImageStyle = { width: 80, height: 80, marginRight: spacing[2] }
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export const GroupsScreen: FC<StackScreenProps<TabNavigatorParamList, "groups">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    const [groups, setGroups] = useState([])

    useEffect(() => {
      setGroups([
        { id: 1, name: "Grupo #1", destination: "Parada do shopping ABC", time: "08:00", count: 5 },
        { id: 2, name: "Grupo #2", destination: "Parada do shopping DEF", time: "12:00", count: 5 },
        { id: 3, name: "Grupo #3", destination: "Parada do shopping GHI", time: "18:00", count: 5 },
      ]);
    }, []);

    const back = () => {
      console.log("GROUPS")
      navigation.goBack()
    }

    // Pull in navigation via hook
    return (
      <View testID="LoginScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Text style={TITLE} preset="header" text="Seus grupos" />
          {groups.map((group) => (
            <View key={group.id} style={GROUP_ITEM}>
              <Icon icon="bug" style={IMAGE} />
              <View>
                <Text style={GROUP_NAME}>{group.name}</Text>
                <Text style={GROUP_DESTINATION}>{group.destination}</Text>
                <View style={GROUP_FOOTER}>
                  <Text style={GROUP_FOOTER_TEXT}>{group.time}</Text>
                  <Text style={GROUP_FOOTER_TEXT}>{group.count} pessoas</Text>
                </View>
              </View>
            </View>
          ))}
        </Screen>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              testID="next-screen-button"
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              text="VOLTAR"
              onPress={() => {
                back()
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  },
)
