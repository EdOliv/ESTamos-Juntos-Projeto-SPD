import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, ImageStyle } from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"

import {
  Button,
  Text,
  TextField,
  Icon
} from "../../components"
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
  width: 100,
  height: 100,
  alignSelf: "center",
  marginTop: spacing[3],
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing[5],
  marginBottom: spacing[1],
}

const BUTTON_SAVE: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginTop: spacing[5],
}

const BUTTON_DELETE: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.error,
  marginVertical: spacing[3],
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.background,
}


export const ProfileScreen: FC<
  BottomTabNavigationProp<TabNavigatorParamList, "profile">
> = observer(() => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const navigation = useNavigation<BottomTabNavigationProp<any, any>>()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const emailTextInput = useRef(null)
  const passwordTextInput = useRef(null)

  const logout = () => {
    console.log("LOGOUT")
    navigation.navigate("login")
  }

  // Pull in navigation via hook
  return (
    <View testID="ProfileScreen" style={FULL}>
      
      <Text style={TITLE} preset="header" text="Perfil" />

      <ScrollView style={CONTAINER}>
        <Icon icon="bug" style={IMAGE} />
        
        <Text style={FIELD_TITLE}>Seu nome</Text>
        <TextField
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailTextInput.current.focus()
          }}
          blurOnSubmit={false}
        />
        <Text style={FIELD_TITLE}>Seu e-mail</Text>
        <TextField
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={emailTextInput}
        />
        <Text style={FIELD_TITLE}>Sua senha</Text>
        <TextField
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={logout}
          forwardedRef={passwordTextInput}
        />
        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={BUTTON_SAVE}
            textStyle={BUTTON_TEXT}
            text="SALVAR ALTERAÇÕES"
            onPress={() => {
              logout()
            }}
          />
          <Button
            testID="next-screen-button"
            style={BUTTON_DELETE}
            textStyle={BUTTON_TEXT}
            text="EXCLUIR PERFIL"
            onPress={() => {
              logout()
            }}
          />
        </View>
      </ScrollView>
        
    </View>
  )
})
