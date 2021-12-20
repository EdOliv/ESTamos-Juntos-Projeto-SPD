import React, { FC, useRef, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  ImageStyle,
  Alert,
} from "react-native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import { MaterialIcons as Icons } from "@expo/vector-icons"

import { Button, Text, TextField, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { openImagePickerAsync } from "../../utils/image-picker"
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types"


const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: "stretch",
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
}

const IMAGE_CONTAINER: ImageStyle = {
  flexDirection: "column",
  alignItems: "center",
}

const IMAGE: ImageStyle = {
  width: 128,
  height: 128,
  alignSelf: "center",
  marginTop: spacing[3],
  borderRadius: spacing[8]
}

const IMAGE_BUTTON = {
  fontFamily: typography.bold,
  padding: spacing[3],
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


export const ProfileEditScreen: FC<BottomTabNavigationProp<
  TabNavigatorParamList, "profile_edit">> = observer(() => {

    const navigation = useNavigation<BottomTabNavigationProp<any, any>>()

    const { userStore } = useStores()

    const [name, setName] = useState(userStore.userData ? userStore.userData.username : "--")
    const [email, setEmail] = useState(userStore.userData ? userStore.userData.email : "--")
    const [password, setPassword] = useState("")
    const [firmPassword, setFirmPassword] = useState("")

    const [userImage, setUserImage] = useState(null)

    const defaultImage = require("../../../assets/images/user.png")

    const [selectedImage, setSelectedImage] = useState<any | null>(null)
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

    const emailTextInput = useRef(null)
    const passwordTextInput = useRef(null)

    useEffect(() => {
      async function fetchData() {
        console.log("FETCH_DATA")
        const result = await userStore.getAccountData()
        setUserImage(result.userData.profilePictureUrl)
      }
      fetchData()
    }, [])

    const goBack = () => {
      navigation.navigate("profile")
    }

    const onImageSelect = async () => {
      const pickerResult = await openImagePickerAsync()
      if (!pickerResult.cancelled) {
        setSelectedImage(pickerResult)
        const { uri } = pickerResult as ImageInfo
        setSelectedImageUri(uri)
      }
    }

    const saveProfile = async () => {
      console.log("EDIT_GROUP")

      const image = selectedImage?.base64
      const res = await userStore.updateUser(name, name, email, password, image)
      if (!res) {
        Alert.alert("Error", "User could not be updated")
        return
      }
      navigation.navigate("profile")
    }

    const logout = () => {
      navigation.navigate("login")
    }

    return (
      <ScrollView testID="ProfileEditScreen" style={FULL}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>

        <View style={CONTAINER}>
          <View style={IMAGE_CONTAINER}>
            <AutoImage
              style={IMAGE}
              source={
                (selectedImageUri && { uri: selectedImageUri }) ||
                (userImage && { uri: userImage }) ||
                defaultImage
              }
            />
            <TouchableOpacity onPress={onImageSelect}>
              <Text style={IMAGE_BUTTON}>Selecionar foto</Text>
            </TouchableOpacity>
          </View>

          <Text style={FIELD_TITLE}>Novo nome</Text>
          <TextField
            value={name}
            maxLength={20}
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
            maxLength={35}
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
              testID="save-profile-button"
              style={BUTTON_SAVE}
              textStyle={BUTTON_TEXT}
              text="SALVAR ALTERAÇÕES"
              onPress={saveProfile}
            />
            <Button
              testID="logout-button"
              style={BUTTON_DELETE}
              textStyle={BUTTON_TEXT}
              text="EXCLUIR PERFIL"
              onPress={logout}
            />
          </View>
       
        </View>
      </ScrollView>
    )
  }
)
