import React, { FC, useRef, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"

import {
  Button,
  Text,
  TextField,
  Icon
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons" 

import { useStores } from "../../models"


const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: 'stretch'
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
}

const IMAGE: ImageStyle = {
  width: 100,
  height: 100,
  alignSelf: "center",
  marginTop: spacing[3],
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  fontFamily: typography.bold,
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
  fontSize: 13,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.background,
}


export const ProfileEditScreen: FC<
BottomTabNavigationProp<TabNavigatorParamList, "profile">
> = observer(() => {
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const navigation = useNavigation<BottomTabNavigationProp<any, any>>()

  const { userStore } = useStores()

  const [name, setName] = useState(userStore.userData ? userStore.userData.username : "--")
  const [email, setEmail] = useState(userStore.userData ? userStore.userData.email : "--")
  const [password, setPassword] = useState("")
  const [firmPassword, setFirmPassword] = useState("")

  const emailTextInput = useRef(null)
  const passwordTextInput = useRef(null)

  useEffect(() => {
    async function fetchData() {
      console.log("FETCH_DATA")
      await userStore.getAccountData()
    }
    fetchData()
  }, [])

  const goBack = () => {
    navigation.navigate("profile")
  }

  const logout = () => {
    navigation.navigate("login")
  }

  // Pull in navigation via hook
  return (
    <ScrollView testID="ProfileScreen" style={FULL}>

      <TouchableOpacity onPress={goBack}>
        <Icons size={35} name='keyboard-return' color={color.primary} />
      </TouchableOpacity>

      <View style={CONTAINER}>
        <Icon icon="bug" style={IMAGE} />
        
        <Text style={FIELD_TITLE}>Novo nome</Text>
        <TextField
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailTextInput.current.focus()
          }}
          blurOnSubmit={false}
        />
        <Text style={FIELD_TITLE}>Novo e-mail</Text>
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
        <Text style={FIELD_TITLE}>Nova senha</Text>
        <TextField
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="next"
          forwardedRef={passwordTextInput}
        />
        <Text style={FIELD_TITLE}>Confirmar nova senha</Text>
        <TextField
          secureTextEntry
          value={firmPassword}
          onChangeText={setFirmPassword}
          returnKeyType="go"
          forwardedRef={passwordTextInput}
        />

        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={BUTTON_SAVE}
            textStyle={BUTTON_TEXT}
            text="SALVAR ALTERAÇÕES"
            onPress={goBack}
          />
          <Button
            testID="next-screen-button"
            style={BUTTON_DELETE}
            textStyle={BUTTON_TEXT}
            text="EXCLUIR PERFIL"
            onPress={logout}
          />
        </View>
      </View>
        
    </ScrollView>
  )
})
