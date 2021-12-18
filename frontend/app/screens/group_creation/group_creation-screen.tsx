import React, { FC, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle, 
  ScrollView,
  TouchableOpacity,
  ImageStyle,
  Picker
} from "react-native"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types"
import { MaterialIcons as Icons } from "@expo/vector-icons"

import { Text, TextField, Button, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { openImagePickerAsync } from "../../utils/image-picker"
import { groupTypes, busStop, district, hours, minutes } from '../group_creation/picker-data'


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
  marginVertical: spacing[6],
}

const ENTER_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}

const PICKER_CONTAINER: ViewStyle = {
  minHeight: 44,
  paddingHorizontal: spacing[2],
  borderRadius: 10,
  marginTop: spacing[3],
  borderWidth: 0,
  backgroundColor: color.bar,
  justifyContent: "center",
}

const PICKER_FIELD: TextStyle = {
  ...TEXT,
  borderRadius: 10,
  borderWidth: 0,
  backgroundColor: color.bar,
}

const TIME_PICKER_CONTAINER: TextStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}

const TIME_PICKER_ITEM: TextStyle = {
  minHeight: 44,
  paddingHorizontal: spacing[2],
  marginRight: spacing[4],
  borderRadius: 10,
  marginTop: spacing[3],
  borderWidth: 0,
  backgroundColor: color.bar,
  justifyContent: "center",
  width: 70,
  color: color.text,
}

const TIME_PICKER: TextStyle = {
  ...TEXT,
  borderRadius: 10,
  borderWidth: 0,
  backgroundColor: color.bar,
  color: color.text,
}

const TIME_PICKER_SEPARATOR: TextStyle = {
  ...TEXT,
  marginRight: spacing[4],
  fontSize: 26,
}


export const GroupCreationScreen: FC<StackScreenProps<
  TabNavigatorParamList, "group_creation">> = observer(({ navigation }) => {

  const { groupStore } = useStores()

  const [type, setType] = useState(groupTypes[0])
  const [name, setName] = useState("")
  const [meeting, setMeeting] = useState("")
  const [destination, setDestination] = useState(busStop[0])
  const [hour, setHour] = useState(hours[0])
  const [min, setMin] = useState(minutes[0])
  const [details, setDetails] = useState("")

  const [selectedImage, setSelectedImage] = useState<any | null>(null)
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

  const nameTextInput = useRef(null)
  const meetingTextInput = useRef(null)
  const destinationTextInput = useRef(null)
  const detailsTextInput = useRef(null)
  
  const defaultImage = require("../../../assets/images/crowd.png")

  const changeType = (value) => {
    setType(value)
    if (value === groupTypes[0]) {
      setDestination(busStop[0])
    } else {
      setDestination(district[0])
    }
  }

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
    const res = await groupStore.createGroup(name, type, meeting, destination, hour+":"+min, details, image)
    console.log(res)
    navigation.navigate("groups")
  }

  return (
    <ScrollView testID="GroupCreationScreen" style={FULL}>
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
          <TouchableOpacity onPress={onImageSelect}>
            <Text style={IMAGE_BUTTON}>Selecionar foto</Text>
          </TouchableOpacity>
        </View>

        <Text style={FIELD_TITLE}>Nome do grupo</Text>
        <TextField
          value={name}
          maxLength={15}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            meetingTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={nameTextInput}
        />

        <Text style={FIELD_TITLE}>Tipo do grupo</Text>
        <View style={PICKER_CONTAINER}>
          <Picker
            style={PICKER_FIELD}
            selectedValue={type}
            onValueChange={changeType}
            itemStyle={TEXT}
          >
            {
              groupTypes.map(groupTypes =>
                <Picker.Item key={groupTypes} label={groupTypes} value={groupTypes}/>
              )
            }
          </Picker>
        </View>

        <Text style={FIELD_TITLE}>Ponto de encontro</Text>
        <TextField
          value={meeting}
          maxLength={35}
          onChangeText={setMeeting}
          returnKeyType="next"
          onSubmitEditing={() => {
            destinationTextInput.current.focus()
          }}
          blurOnSubmit={false}
          forwardedRef={meetingTextInput}
        />

        <Text style={FIELD_TITLE}>Destino</Text>
        <View style={PICKER_CONTAINER}>
          {type === groupTypes[0] ? (
            <Picker
              style={PICKER_FIELD}
              selectedValue={destination}
              onValueChange={setDestination}
              itemStyle={TEXT}
            >
              {
                busStop.map(busStop =>
                  <Picker.Item key={busStop} label={busStop} value={busStop}/>
                )
              }
            </Picker>
          ) : (
            <Picker
              style={PICKER_FIELD}
              selectedValue={destination}
              onValueChange={setDestination}
              itemStyle={TEXT}
            >
              {
                district.map(district =>
                  <Picker.Item key={district} label={district} value={district}/>
                )
              }
            </Picker>
          )}
        </View>

        <Text style={FIELD_TITLE}>Horário de saída</Text>
        <View style={TIME_PICKER_CONTAINER}>
          <View style={TIME_PICKER_ITEM}>
            <Picker
              style={TIME_PICKER}
              selectedValue={hour}
              onValueChange={setHour}
              itemStyle={TEXT}
            >
              {
                hours.map(hours =>
                  <Picker.Item key={hours} label={hours} value={hours}/>
                )
              }
            </Picker>
          </View>
          <Text style={TIME_PICKER_SEPARATOR}>:</Text>
          <View style={TIME_PICKER_ITEM}>
            <Picker
              style={TIME_PICKER}
              selectedValue={min}
              onValueChange={setMin}
              itemStyle={TEXT}
            >
              {
                minutes.map(minutes =>
                  <Picker.Item key={minutes} label={minutes} value={minutes}/>
                )
              }
            </Picker>
          </View>
        </View>
        
        <Text style={FIELD_TITLE}>Outros detalhes</Text>
        <TextField
          value={details}
          maxLength={35}
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
