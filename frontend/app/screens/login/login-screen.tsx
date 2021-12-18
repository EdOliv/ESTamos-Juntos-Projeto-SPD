import React, { FC, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"

import { Button, Text, AutoImage as Image, TextField } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { saveString } from "../../utils/storage"


const FULL: ViewStyle = {
  flex: 1,
  paddingTop: spacing[8],
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: "center",
}

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignContent: "center",
  paddingBottom: spacing[2],
}

const TEXT: TextStyle = {
  color: color.text,
  fontFamily: typography.primary,
}

const LOGO: ImageStyle = {
  marginVertical: spacing[3],
  alignSelf: "center",
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[5],
  fontFamily: typography.bold,
}

const ENTER: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginVertical: spacing[6],
}

const ENTER_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}

const FOOTER_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 13,
  marginVertical: spacing[2],
  alignSelf: "center",
  textDecorationLine: "underline",
}


export const LoginScreen: FC<StackScreenProps<
  NavigatorParamList, "login">> = observer(({ navigation }) => {
    
    const { authStore } = useStores()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const passwordTextInput = useRef(null)

    const login = async () => {
      console.log("LOGIN")
      await authStore.login(email, password)

      if (authStore.isAuthenticated) {
        await saveString("@ESTamosJuntos:accessToken", authStore.accessToken)
        await saveString("@ESTamosJuntos:refreshToken", authStore.refreshToken)
        navigation.navigate("tabs")
      } else {
        Alert.alert("Error", "Login failed")
      }
    }

    const register = () => {
      navigation.navigate("register")
    }

    const forgotPassword = () => {
      navigation.navigate("reset_password")
    }

    return (
      <ScrollView testID="LoginScreen" style={FULL}>
        <View style={CONTAINER}>
          
          <Image source={require("./logo.png")} style={LOGO} />
          
          <Text style={FIELD_TITLE}>E-mail</Text>
          <TextField
            value={email}
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
            returnKeyType="go"
            onSubmitEditing={login}
            forwardedRef={passwordTextInput}
          />
          
          <Button
            testID="next-screen-button"
            style={ENTER}
            textStyle={ENTER_TEXT}
            text="ENTRAR"
            onPress={login}
          />

          <TouchableOpacity onPress={forgotPassword}>
            <Text style={FOOTER_TEXT}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={register}>
            <Text style={FOOTER_TEXT}>É novo por aqui? Registre-se agora!</Text>
          </TouchableOpacity>
        
        </View>
      </ScrollView>
    )
  },
)
