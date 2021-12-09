import React, { FC, useEffect, useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { Text, Icon, TextField, Button } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { useStores } from "../../models"


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
}

const BUTTON_EDIT: ViewStyle = {
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


export const GroupEditScreen: FC<StackScreenProps<
TabNavigatorParamList, "group_edit">> = observer(

  ({ route, navigation }) => {
    // Pull in one of our MST stores
    const { groupStore } = useStores()

    const [id, setId] = useState(0)
    const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [meeting, setMeeting] = useState("")
    const [destination, setDestination] = useState("")
    const [hour, setHour] = useState("")
    const [details, setDetails] = useState("")

    useEffect(() => {
      const loadGroup = async () => {
        const editGroup = await groupStore.getGroupData(route.params.groupId)
        setId(editGroup.id)
        setType(editGroup.groupType)
        setName(editGroup.name)
        setMeeting(editGroup.startName)
        setDestination(editGroup.destinationName)
        setHour(editGroup.meetingTime)
        setDetails(editGroup.description)
      }
      loadGroup()
    }, [])

    const goBack = () => {
      navigation.navigate("group_details", { groupId: id })
    }

    const saveGroup = () => {
      navigation.navigate("group_details", { groupId: id })
    }

    const deleteGroup = () => {
      navigation.navigate("groups")
    }

    const nameTextInput = useRef(null)
    const meetingTextInput = useRef(null)
    const destinationTextInput = useRef(null)
    const hourTextInput = useRef(null)
    const detailsTextInput = useRef(null)

    return (
      <ScrollView testID="GroupEditScreen" style={FULL}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>

        <View style={CONTAINER}>
          <Icon icon="bug" style={IMAGE} />

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
            forwardedRef={meetingTextInput}
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
            onSubmitEditing={saveGroup}
            blurOnSubmit={false}
            forwardedRef={detailsTextInput}
          />

          <View style={FOOTER_CONTENT}>
              <Button
                testID="next-screen-button"
                style={BUTTON_EDIT}
                textStyle={BUTTON_TEXT}
                text="SALVAR ALTERAÇÕES"
                onPress={saveGroup}
              />
              <Button
                testID="next-screen-button"
                style={BUTTON_DELETE}
                textStyle={BUTTON_TEXT}
                text="EXCLUIR GRUPO"
                onPress={deleteGroup}
              />

          </View>
        </View>
      </ScrollView>
    )
  },
)
