import React, { FC, useEffect, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  ImageStyle
} from "react-native"
import { observer } from "mobx-react-lite"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"

import { Button, Text, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"


const FULL: ViewStyle = {
  flex: 1,
}

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
  fontSize: 26,
  textAlign: "center",
  color: color.textButton,
  backgroundColor: color.button,
  paddingVertical: spacing[3],
  fontFamily: typography.bold,
}

const IMAGE: ImageStyle = {
  width: 128,
  height: 128,
  alignSelf: "center",
  marginTop: spacing[7],
  borderRadius: spacing[8]
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  fontFamily: typography.bold,
  marginTop: spacing[5],
  marginBottom: spacing[1],
}

const FIELD_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  marginTop: spacing[2],
}

const BUTTON_SAVE: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginTop: spacing[5],
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontSize: 13,
  letterSpacing: 2,
}

const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[6],
  backgroundColor: color.background,
}


export const ProfileScreen: FC<BottomTabNavigationProp<
  TabNavigatorParamList, "profile">> = observer(() => {

    const { userStore } = useStores()

    const username = userStore.userData ? userStore.userData.username : "--";
    const email = userStore.userData ? userStore.userData.email : "--";

    const [userImage, setUserImage] = useState(null);

    const navigation = useNavigation<BottomTabNavigationProp<any, any>>()
    
    const defaultImage = require("../../../assets/images/user.png")

    useEffect(() => {
      async function fetchData() {
        console.log("FETCH_DATA")
        const result = await userStore.getAccountData();
        setUserImage(result.userData.profilePictureUrl);
      }
      fetchData()
    }, [])

    const editProfile = () => {
      navigation.navigate("profile_edit")
    }

    return (
      <View testID="ProfileScreen" style={FULL}>
        <Text style={TITLE} preset="header" text="Perfil" />

        <ScrollView style={CONTAINER}>
          <AutoImage
            style={IMAGE}
            source={
              (userImage && { uri: userImage }) || defaultImage
            }
          />

          <Text style={FIELD_TITLE}>Seu nome</Text>
          <Text style={FIELD_TEXT}>{ username }</Text>

          <Text style={FIELD_TITLE}>Seu e-mail</Text>
          <Text style={FIELD_TEXT}>{ email }</Text>

          <View style={FOOTER_CONTENT}>
            <Button
              testID="next-screen-button"
              style={BUTTON_SAVE}
              textStyle={BUTTON_TEXT}
              text="EDITAR PERFIL"
              onPress={editProfile}
            />
          </View>
        
        </ScrollView>
      </View>
    )
  }
)
