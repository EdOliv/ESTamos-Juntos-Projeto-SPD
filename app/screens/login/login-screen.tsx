import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import {
  Button,
  Screen,
  Text,
  GradientBackground,
  AutoImage as Image,
  TextField,
} from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"

const logoIgnite = require("./logo-ignite.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  justifyContent: "center",
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const IGNITE: ImageStyle = {
  marginVertical: spacing[6],
  alignSelf: "center",
  width: 180,
  height: 100,
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

export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const passwordTextInput = useRef(null);

    const login = () => {
      console.log("LOGIN")
      navigation.navigate("tabs")
    }

    // Pull in navigation via hook
    return (
      <View testID="LoginScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Image source={logoIgnite} style={IGNITE} />
          <TextField
            label="Email ou telefone"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />
          <TextField
            label="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="go"
            onSubmitEditing={login}
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
              text="ENTRAR"
              onPress={() => {
                login()
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  },
)
