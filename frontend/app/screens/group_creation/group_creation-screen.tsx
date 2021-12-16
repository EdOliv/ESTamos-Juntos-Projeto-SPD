import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types"

import { Text, TextField, Button, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { useStores } from "../../models"
import { openImagePickerAsync } from "../../utils/image-picker"

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: "stretch",
}

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignContent: "stretch",
  paddingBottom: spacing[6],
}

const TEXT: TextStyle = {
  color: color.text,
  fontFamily: typography.primary,
}

const IMAGE_CONTAINER: ImageStyle = {
  flexDirection: "column",
  alignItems: "center",
}

const IMAGE: ImageStyle = {
  width: 100,
  height: 100,
  alignSelf: "center",
  marginTop: spacing[3],
  borderRadius: 10
}

const IMAGE_BUTTON = {
  padding: spacing[3],
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
  marginVertical: spacing[6],
}

const ENTER_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}

export const GroupCreationScreen: FC<
  StackScreenProps<TabNavigatorParamList, "group_creation">
> = observer(({ navigation }) => {
  // Pull in one of our MST stores
  const { groupStore } = useStores()

  const [type, setType] = useState("") // "caminhada" or "carona"
  const [name, setName] = useState("")
  const [meeting, setMeeting] = useState("")
  const [destination, setDestination] = useState("")
  const [hour, setHour] = useState("")
  const [details, setDetails] = useState("")

  const [selectedImage, setSelectedImage] = useState<any | null>(null)
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

  const nameTextInput = useRef(null)
  const meetingTextInput = useRef(null)
  const destinationTextInput = useRef(null)
  const hourTextInput = useRef(null)
  const detailsTextInput = useRef(null)
  
  const defaultImage = require("../../../assets/images/crowd.png")

  const goBack = () => {
    navigation.navigate("groups")
  }

  const onImageSelect = async () => {
    const pickerResult = await openImagePickerAsync();
    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult)
      const { uri } = pickerResult as ImageInfo
      setSelectedImageUri(uri)
    }
  }

  const createGroup = async () => {
    console.log("CREATE_GROUP")

    const image = selectedImage?.base64
    const res = await groupStore.createGroup(name, type, meeting, destination, hour, details, image)
    console.log(res)
    navigation.navigate("groups")
  }

  return (
    <ScrollView testID="NewGroupScreen" style={FULL}>
      <TouchableOpacity onPress={goBack}>
        <Icons size={35} name="keyboard-return" color={color.primary} />
      </TouchableOpacity>

      <View style={CONTAINER}>
        <View style={IMAGE_CONTAINER}>
          <AutoImage
            style={IMAGE}
            source={
              (selectedImageUri && { uri: selectedImageUri }) ||
              defaultImage
            }
          />
          <TouchableOpacity style={IMAGE_BUTTON} onPress={onImageSelect}>
            <Text>Selecionar Foto</Text>
          </TouchableOpacity>
        </View>

        <Text style={FIELD_TITLE}>Tipo do grupo</Text>
        <TextField
          value={type}
          onChangeText={setType}
          returnKeyType="next"
          onSubmitEditing={() => {
            nameTextInput.current.focus()
          }}
          blurOnSubmit={false}
        />

        <Text style={FIELD_TITLE}>Nome do grupo</Text>
        <TextField
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            meetingTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={nameTextInput}
        />

        <Text style={FIELD_TITLE}>Ponto de encontro</Text>
        <TextField
          value={meeting}
          onChangeText={setMeeting}
          returnKeyType="next"
          onSubmitEditing={() => {
            destinationTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={meetingTextInput}
        />

        <Text style={FIELD_TITLE}>Destino</Text>
        <TextField
          value={destination}
          onChangeText={setDestination}
          returnKeyType="next"
          onSubmitEditing={() => {
            hourTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={destinationTextInput}
        />

        <Text style={FIELD_TITLE}>Horário de saída</Text>
        <TextField
          value={hour}
          onChangeText={setHour}
          returnKeyType="next"
          onSubmitEditing={() => {
            detailsTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={hourTextInput}
        />

        <Text style={FIELD_TITLE}>Outros detalhes</Text>
        <TextField
          value={details}
          onChangeText={setDetails}
          returnKeyType="go"
          onSubmitEditing={createGroup}
          blurOnSubmit={false}
          forwardedRef={detailsTextInput}
        />

        <Button
          testID="next-screen-button"
          style={ENTER}
          textStyle={ENTER_TEXT}
          text="CRIAR GRUPO"
          onPress={createGroup}
        />
      </View>
    </ScrollView>
  )
})
