import React, { FC, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { MaterialIcons as Icons } from "@expo/vector-icons"

import { Button, Text, TextField } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { saveString } from "../../utils/storage"


const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: "stretch",
}

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignContent: "stretch",
  paddingBottom: spacing[2],
}

const TEXT: TextStyle = {
  color: color.text,
  fontFamily: typography.primary,
}

const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 26,
  textAlign: "center",
  color: color.text,
  marginVertical: spacing[5],
	fontFamily: typography.bold,
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  fontFamily: typography.bold,
  marginTop: spacing[5],
}

const ENTER: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginVertical: spacing[7],
}

const ENTER_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}


export const RegisterScreen: FC<StackScreenProps<
  NavigatorParamList, "register">> = observer(({ navigation }) => {

    const { authStore } = useStores()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firmPassword, setFirmPassword] = useState("")

    const passwordTextInput = useRef(null)

    const signUp = async () => {
      console.log("SIGN_UP")
      await authStore.signUp(name, email, password)
      if (authStore.isAuthenticated) {
        await saveString("@ESTamosJuntos:accessToken", authStore.accessToken)
        await saveString("@ESTamosJuntos:refreshToken", authStore.refreshToken)
        navigation.navigate("tabs")
      } else {
        Alert.alert("Error", "Sign up failed")
      }
    }

    const goBack = () => {
      navigation.navigate("login")
    }

    return (
      <ScrollView testID="RegisterScreen" style={FULL}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>

        <Text style={TITLE} text="Registrar-se" />

        <View style={CONTAINER}>
          <Text style={FIELD_TITLE}>Nome de usuário</Text>
          <TextField
            value={name}
            maxLength={20}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordTextInput.current.focus()
            }}
            blurOnSubmit={false}
          />

          <Text style={FIELD_TITLE}>E-mail</Text>
          <TextField
            value={email}
            maxLength={35}
            onChangeText={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordTextInput.current.focus()
            }}
            blurOnSubmit={false}
          />

          <Text style={FIELD_TITLE}>Senha</Text>
          <TextField
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordTextInput.current.focus()
            }}
            forwardedRef={passwordTextInput}
          />

          <Text style={FIELD_TITLE}>Confirmar senha</Text>
          <TextField
            secureTextEntry
            value={firmPassword}
            onChangeText={setFirmPassword}
            returnKeyType="go"
            onSubmitEditing={signUp}
            forwardedRef={passwordTextInput}
          />

          <Button
            testID="sign-up-button"
            style={ENTER}
            textStyle={ENTER_TEXT}
            text="REGISTRAR"
            onPress={() => {
              signUp()
            }}
          />
        
        </View>
      </ScrollView>
    )
  },
)
