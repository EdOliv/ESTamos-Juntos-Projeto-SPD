import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { Text, Icon } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"


const FULL: ViewStyle = { flex: 1 }

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
}

const TITLE: TextStyle = {
  ...TEXT,
  fontWeight: "bold",
  fontSize: 28,
  textAlign: "center",
  color: color.textButton,
  backgroundColor: color.button,
  paddingVertical: spacing[3],
}

const IMAGE: ImageStyle = {
  width: 80,
  height: 80,
  marginRight: spacing[5],
  marginLeft: spacing[3],
}

const GROUP_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[5],
  paddingBottom: spacing[5],
  borderBottomColor: color.primary,
  borderBottomWidth: 1,
}

const GROUP_NAME: TextStyle = {
  ...TEXT,
  fontSize: 20,
  fontWeight: "bold",
}

const GROUP_DESTINATION: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[3],
}

const GROUP_FOOTER: ViewStyle = {
  ...TEXT,
  flexDirection: "row",
}

const GROUP_FOOTER_TEXT: ViewStyle = {
  ...TEXT,
  marginTop: spacing[3],
  flex: 1,
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


    // Pull in navigation via hook
    return (
      <View testID="LoginScreen" style={FULL}>
        
        <Text style={TITLE} preset="header" text="Seus grupos" />
        
        <ScrollView style={CONTAINER}>
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
        </ScrollView>
      </View>
    )
  },
)
