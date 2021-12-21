import React from "react"
import { useColorScheme, View } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  GroupCreationScreen,
  GroupDetailsScreen,
  GroupEditScreen,
  ProfileEditScreen,
  ProfileOthersScreen,
  GroupChatScreen
} from "../screens"
import { navigationRef } from "./navigation-utilities"
import { TabNavigator } from "./tab-navigator"
import { color } from "../theme"


export type NavigatorParamList = {
  tabs: undefined
  login: undefined
  register: undefined
  reset_password: undefined
  profile_edit: undefined
  group_creation: undefined
  group_details: undefined
  group_chat: undefined
  group_edit: undefined
  profile_others: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="reset_password" component={ResetPasswordScreen} />
      <Stack.Screen name="tabs" component={TabNavigator} />
      <Stack.Screen name="profile_edit" component={ProfileEditScreen} />
      <Stack.Screen name="group_creation" component={GroupCreationScreen} />
      <Stack.Screen name="group_details" component={GroupDetailsScreen} />
      <Stack.Screen name="group_edit" component={GroupEditScreen} />
      <Stack.Screen name="profile_others" component={ProfileOthersScreen} />
      <Stack.Screen name="group_chat" component={GroupChatScreen} />
    </Stack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const x = {
    flex: 1,
    paddingTop: insets.top,
    backgroundColor: color.button
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <View style={x}>

      <AppStack />
      </View>
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
