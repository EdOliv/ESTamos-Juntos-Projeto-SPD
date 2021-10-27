import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"

import { Screen, Text, GradientBackground, TextField } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[6]
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

export const SearchScreen: FC<BottomTabNavigationProp<TabNavigatorParamList, "search">> = observer(
  function SearchScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    const [search, setSearch] = useState("")

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <View testID="SearchScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Text style={TITLE} preset="header" text="Encontrar grupos" />
          <TextField
            label="Buscar"
            value={search}
            onChangeText={setSearch}
            returnKeyType="go"
            blurOnSubmit={false}
          />
          <Text style={CONTENT}>Esqueceu sua senha?</Text>
          <Text style={CONTENT}>É novo por aqui? Registre-se agora!</Text>
        </Screen>
      </View>
    )
  },
)
