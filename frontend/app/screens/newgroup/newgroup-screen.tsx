import React, { FC, useRef, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import {
	Text,
	Icon,
	TextField,
	Button
} from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons" 


const FULL: ViewStyle = {
  flex: 1,
	paddingTop: spacing[7],
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: 'stretch'
}

const CONTAINER: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'stretch',
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
  fontSize: 18,
  fontWeight: "bold",
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
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}


export const NewGroupScreen: FC<StackScreenProps<TabNavigatorParamList, "newgroup">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

		const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [meeting, setMeeting] = useState("")
    const [destination, setDestination] = useState("")
    const [hour, setHour] = useState("")
		const [details, setDetails] = useState("")
    
    const passwordTextInput = useRef(null);

    const goBack = () => {
      navigation.navigate("groups")
    }

    return (
      <ScrollView testID="NewGroupScreen" style={FULL}>

        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name='keyboard-return' color={color.primary} />
        </TouchableOpacity>

				<View style={CONTAINER}>
					<Icon icon="bug" style={IMAGE} />

					<Text style={FIELD_TITLE}>Tipo do grupo</Text>
          <TextField
            value={type}
            onChangeText={setType}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />

          <Text style={FIELD_TITLE}>Nome do grupo</Text>
          <TextField
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />

          <Text style={FIELD_TITLE}>Ponto de encontro</Text>
          <TextField
            value={meeting}
            onChangeText={setMeeting}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />

					<Text style={FIELD_TITLE}>Destino</Text>
          <TextField
            value={destination}
            onChangeText={setDestination}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />

					<Text style={FIELD_TITLE}>Horário de saída</Text>
          <TextField
            value={hour}
            onChangeText={setHour}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />

					<Text style={FIELD_TITLE}>Outros detalhes</Text>
          <TextField
            value={details}
            onChangeText={setDetails}
            returnKeyType="go"
            onSubmitEditing={goBack}
            blurOnSubmit={false}
          />

          <Button
            testID="next-screen-button"
            style={ENTER}
            textStyle={ENTER_TEXT}
            text="CRIAR GRUPO"
            onPress={goBack}
          />

        </View>

      </ScrollView>
    )
  },
)