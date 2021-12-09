import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, ImageStyle } from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"

import { Button, Text, Icon } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { clear } from "../../utils/storage"

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
  width: 120,
  height: 120,
  alignSelf: "center",
  marginTop: spacing[7],
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing[5],
  marginBottom: spacing[1],
}

const FIELD_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[2],
}

const BUTTON_SAVE: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginTop: spacing[5],
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[6],
  backgroundColor: color.background,
}

export const ProfileScreen: FC<
BottomTabNavigationProp<TabNavigatorParamList, "profile">
> = observer(() => {

  // Pull in one of our MST stores
  const { userStore } = useStores()
  const username = userStore.userData ? userStore.userData.username : "--";
  const email = userStore.userData ? userStore.userData.email : "--";

  const navigation = useNavigation<BottomTabNavigationProp<any, any>>()

  useEffect(() => {
    async function fetchData() {
      console.log("FETCH_DATA")
      await userStore.getAccountData()
    }
    fetchData()
  }, [])

  const editProfile = () => {
    navigation.navigate("profile_edit")
  }

  // Pull in navigation via hook
  return (
    <View testID="ProfileScreen" style={FULL}>
      <Text style={TITLE} preset="header" text="Perfil" />

      <ScrollView style={CONTAINER}>
        <Icon icon="bug" style={IMAGE} />

        <Text style={FIELD_TITLE}>Seu nome</Text>
        <Text style={FIELD_TEXT}>{ username }</Text>

        <Text style={FIELD_TITLE}>Seu e-mail</Text>
        <Text style={FIELD_TEXT}>{ email }</Text>

        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={BUTTON_SAVE}
            textStyle={BUTTON_TEXT}
            text="EDITAR PERFIL"
            onPress={editProfile}
          />
        </View>
      </ScrollView>
    </View>
  )
})
