import React, { FC, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle, 
  ImageStyle,
  TouchableOpacity, 
  ScrollView, 
  TextInput 
} from "react-native"
import { observer } from "mobx-react-lite"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { StackScreenProps } from "@react-navigation/stack"

import { Text, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"


const FULL: ViewStyle = {
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
  fontSize: 13,
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

const SEARCH_CONTAINER: ViewStyle = {
  marginTop: spacing[6],
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 44,
  backgroundColor: color.bar,
  borderRadius: 10,
  paddingEnd: spacing[2],
}

const SEARCH_BAR: TextStyle = {
  ...TEXT,
  fontSize: 15,
  minHeight: 50,
  paddingHorizontal: spacing[4],
  borderRadius: 10,
  borderWidth: 0,
  backgroundColor: color.bar,
  justifyContent: "center",
  flex: 1,
}

const FILTERS: ViewStyle = {
  flexDirection: "row",
  alignContent: "stretch",
  justifyContent: "flex-start",
  marginTop: spacing[4],
  paddingBottom: spacing[5],
  borderBottomColor: color.primary,
  borderBottomWidth: 1,
}

const FILTER_BUTTON: TextStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginRight: spacing[8],
}

const IMAGE: ImageStyle = {
  width: 80,
  height: 80,
  marginRight: spacing[5],
  marginLeft: spacing[3],
  borderRadius: 10,
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


export const SearchScreen: FC<StackScreenProps<
  TabNavigatorParamList, "search">> = observer(({ navigation }) => {
    
    const { groupStore } = useStores()

    const [search, setSearch] = useState("")

    const [groups, setGroups] = useState([])

    const searchGroups = async () => {
      const newGroups = await groupStore.searchGroups(search)
      setGroups(newGroups)
    }

    return (
      <View testID="SearchScreen" style={FULL}>
        <Text style={TITLE} preset="header" text="ESTamos juntos" />

        <ScrollView style={CONTAINER}>

          <View style={SEARCH_CONTAINER}>
            <TextInput
              style={SEARCH_BAR}
              onChangeText={setSearch}
              returnKeyType="go"
              blurOnSubmit={false}
              onSubmitEditing={searchGroups}
              placeholder="Pesquisar por grupos..."
              placeholderTextColor={color.primary}
            />
            <Icons size={35} name="search" color={color.primary} />
          </View>

          <View style={FILTERS}>
            <TouchableOpacity style={FILTER_BUTTON}>
              <Icons size={35} name="directions-walk" color={color.primary} />
              <Text style={TEXT} text="Caminhada" />
            </TouchableOpacity>
            <TouchableOpacity style={FILTER_BUTTON}>
              <Icons size={35} name="directions-car" color={color.primary} />
              <Text style={TEXT} text="Carona" />
            </TouchableOpacity>
          </View>

          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => {
                navigation.navigate("group_details", { groupId: group.id })
              }}
            >
              <View style={GROUP_ITEM}>
                <AutoImage
                  style={IMAGE}
                  source={
                    (group.image && { uri: group.image }) ||
                    require("../../../assets/images/crowd.png")
                  }
                />
                <View style={FULL}>
                  <Text style={GROUP_NAME}>{group.name}</Text>
                  <Text style={GROUP_DESTINATION}>{group.destinationName}</Text>
                  <View style={GROUP_FOOTER}>
                    <Text style={GROUP_FOOTER_TEXT}>{group.meetingTime.substring(0, 5)}</Text>
                    <Text style={GROUP_FOOTER_TEXT}>{group.usersCount} pessoas</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  },
)
