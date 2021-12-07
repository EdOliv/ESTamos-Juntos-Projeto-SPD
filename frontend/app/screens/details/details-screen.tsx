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

const HEADER: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  alignItems: 'center',
  justifyContent: 'center',
}

const GROUP_IMAGE: ImageStyle = {
  width: 100,
  height: 100,
  alignSelf: "center",
}

const GROUP_NAME: TextStyle = {
  color: color.text,
  fontSize: 22,
  fontFamily: typography.secondary,
  marginTop: spacing[1],
  paddingLeft: spacing[4],
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing[5],
}

const FIELD_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 15,
  marginTop: spacing[2],
}

const USER_IMAGE: ImageStyle = {
  width: 40,
  height: 40,
  alignSelf: "center",
}

const USER_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  alignItems: 'center',
  justifyContent: 'space-between',
}

const USER_SELECT: ViewStyle = {
  flexDirection: "row",
  alignItems: 'center',
}

const USER_NAME: TextStyle = {
  color: color.text,
  fontSize: 15,
  paddingLeft: spacing[3],
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
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.background,
}


export const DetailsScreen: FC<StackScreenProps<TabNavigatorParamList, "details">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    const [people, setPeople] = useState([])
  
    useEffect(() => {
      setPeople([
        { id: 1, name: "Proprietário", owner: 1},
        { id: 2, name: "Participante #1", owner: 0},
        { id: 3, name: "Participante #2", owner: 0},
        { id: 4, name: "Participante #3", owner: 0},
      ]);
    }, []);

    const goBack = () => {
      navigation.navigate("groups")
    }

    const editGroup = () => {
      navigation.navigate("newgroup")
    }

    return (
      <ScrollView testID="NewGroupScreen" style={FULL}>

        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name='keyboard-return' color={color.primary} />
        </TouchableOpacity>

				<View style={CONTAINER}>
          <View style={HEADER}>
            <Icon icon="bug" style={GROUP_IMAGE} />
            <Text style={GROUP_NAME}>Grupinho legal</Text>
          </View>

					<Text style={FIELD_TITLE}>Tipo do grupo</Text>
          <Text style={FIELD_TEXT}>Caminhada</Text>

          <Text style={FIELD_TITLE}>Ponto de encontro</Text>
          <Text style={FIELD_TEXT}>Na frente da sala A21</Text>

					<Text style={FIELD_TITLE}>Destino</Text>
          <Text style={FIELD_TEXT}>Parada do shopping tal</Text>

					<Text style={FIELD_TITLE}>Horário de saída</Text>
          <Text style={FIELD_TEXT}>18:10</Text>

					<Text style={FIELD_TITLE}>Outros detalhes</Text>
          <Text style={FIELD_TEXT}>Sem atrasos!</Text>
          
          <Text style={FIELD_TITLE}>Participantes</Text>

          {people.map((person) => (
            <View style={USER_ITEM}>
              <TouchableOpacity style={USER_SELECT}>
                <Icon icon="bug" style={USER_IMAGE} />
                <Text style={USER_NAME}>{person.name}</Text>
              </TouchableOpacity>
              {person.owner?
                <Icons size={30} name='vpn-key' color={color.palette.gold} />
                :
                <TouchableOpacity>
                  <Icons size={30} name='clear' color={color.error} />
                </TouchableOpacity>
              }
            </View>
          ))}

          <View style={FOOTER_CONTENT}>
            <Button
              testID="next-screen-button"
              style={BUTTON_EDIT}
              textStyle={BUTTON_TEXT}
              text="EDITAR GRUPO"
              onPress={editGroup}
            />
            <Button
              testID="next-screen-button"
              style={BUTTON_DELETE}
              textStyle={BUTTON_TEXT}
              text="EXCLUIR GRUPO"
              onPress={goBack}
            />
          </View>

        </View>

      </ScrollView>
    )
  },
)