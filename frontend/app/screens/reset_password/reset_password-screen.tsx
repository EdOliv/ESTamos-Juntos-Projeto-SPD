import React, { FC, useRef, useState } from "react"
import {
  View, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity, 
  ScrollView
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
  fontSize: 24,
  textAlign: "center",
  color: color.text,
  marginVertical: spacing[5],
	fontFamily: typography.bold,
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[6],
	fontFamily: typography.bold,
}

const INSTRUCTIONS: TextStyle = {
  ...TEXT,
  fontSize: 14,
  marginTop: spacing[4],
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

const FOOTER_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 13,
  marginVertical: spacing[8],
  alignSelf: "center",
  textDecorationLine: "underline",
}


export const ResetPasswordScreen: FC<StackScreenProps<
  NavigatorParamList, "reset_password">> = observer(({ navigation }) => {

    const [email, setEmail] = useState("")

    const passwordTextInput = useRef(null)

    const goBack = () => {
      navigation.navigate("login")
    }

		const send = () => {
      navigation.navigate("login")
    }

		const register = () => {
      navigation.navigate("register")
    }
    
    return (
      <ScrollView testID="ResetPasswordScreen" style={FULL}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>

        <Text style={TITLE} text="Esqueceu sua senha?" />

        <View style={CONTAINER}>
					<Text style={INSTRUCTIONS}>
						Identifique-se com seu e-mail de registro para
						receber as instruções e o link para criar uma nova senha.
					</Text>
					
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

          <Button
            testID="next-screen-button"
            style={ENTER}
            textStyle={ENTER_TEXT}
            text="ENVIAR"
            onPress={send}
          />

					<TouchableOpacity onPress={register}>
            <Text style={FOOTER_TEXT}>É novo por aqui? Registre-se agora!</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    )
  },
)
