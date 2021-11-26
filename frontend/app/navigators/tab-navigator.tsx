/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons as Icons } from "@expo/vector-icons" 
import { SearchScreen, GroupsScreen, ProfileScreen } from "../screens"
import { color } from "../theme"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type TabNavigatorParamList = {
  search: undefined
  groups: undefined
  profile: undefined
  newgroup: undefined
}

const Tab = createBottomTabNavigator<TabNavigatorParamList>()

function TabBarIcon(props: { name: React.ComponentProps<typeof Icons>["name"]; color: string }) {
  const iconStyle = { marginBottom: -3 }
  return <Icons size={35} style={iconStyle} {...props} />
}

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="search"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.primary,
        tabBarInactiveBackgroundColor: color.bar,
        tabBarActiveBackgroundColor: color.bar,
      }}
    >
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: function tbIcon({ color, focused }) {
            return <TabBarIcon name={focused ? "home-search" : "home-search-outline"} color={color} />
          },
        }}
      />
      <Tab.Screen
        name="groups"
        component={GroupsScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: function tabBarIcon({ color, focused }) {
            return <TabBarIcon name={focused ? "account-group" : "account-group-outline"} color={color} />
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: function tabBarIcon({ color, focused }) {
            return <TabBarIcon name={focused ? "account" : "account-outline"} color={color} />
          },
        }}
      />
    </Tab.Navigator>
  )
}
