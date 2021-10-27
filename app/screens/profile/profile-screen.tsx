import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, SafeAreaView } from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"

import {
  Button,
  Screen,
  Text,
  GradientBackground,
  TextField,
} from "../../components"
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

export const ProfileScreen: FC<
  BottomTabNavigationProp<TabNavigatorParamList, "profile">
> = observer(() => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const navigation = useNavigation<BottomTabNavigationProp<any, any>>()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const emailTextInput = useRef(null)
  const phoneTextInput = useRef(null)
  const passwordTextInput = useRef(null)

  const logout = () => {
    console.log("LOGOUT")
    navigation.navigate("login")
  }

  // Pull in navigation via hook
  return (
    <View testID="ProfileScreen" style={FULL}>
      <GradientBackground colors={["#422443", "#281b34"]} />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Text style={TITLE} preset="header" text="Perfil" />
        <TextField
          label="Nome"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailTextInput.current.focus()
          }}
          blurOnSubmit={false}
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          onSubmitEditing={() => {
            phoneTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={emailTextInput}
        />
        <TextField
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={phoneTextInput}
        />
        <TextField
          label="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={logout}
          forwardedRef={passwordTextInput}
        />
        <Text style={CONTENT}>Esqueceu sua senha?</Text>
        <Text style={CONTENT}>É novo por aqui? Registre-se agora!</Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            text="SAIR"
            onPress={() => {
              logout()
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
