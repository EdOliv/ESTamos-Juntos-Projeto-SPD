import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, ImageStyle, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { Button, Text, Icon } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { MaterialIcons as Icons } from "@expo/vector-icons"


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

const IMAGE: ImageStyle = {
  width: 120,
  height: 120,
  alignSelf: "center",
  marginTop: spacing[7],
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


export const ProfileOthersScreen: FC<
StackScreenProps<TabNavigatorParamList, "profile_others">
> = observer(({ route, navigation }) => {

  // Pull in one of our MST stores

  const goBack = () => {
    navigation.goBack()
  }

  // Pull in navigation via hook
  return (
    <View testID="ProfileOthersScreen" style={FULL}>
      <ScrollView style={CONTAINER}>
        <TouchableOpacity onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>
        
        <Icon icon="bug" style={IMAGE} />

        <Text style={FIELD_TITLE}>Nome</Text>
        <Text style={FIELD_TEXT}>{ route.params.groupUserName }</Text>

        <Text style={FIELD_TITLE}>E-mail</Text>
        <Text style={FIELD_TEXT}>algum e-mail</Text>
        
      </ScrollView>
    </View>
  )
})
