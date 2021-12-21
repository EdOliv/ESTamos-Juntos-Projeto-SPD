import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons as Icons } from "@expo/vector-icons" 

import { SearchScreen, GroupsScreen, ProfileScreen } from "../screens"
import { color } from "../theme"


export type TabNavigatorParamList = {
  search: undefined
  groups: undefined
  profile: undefined
  profile_edit: undefined
  group_creation: undefined
  group_details: {
    groupId: number
  }
  group_chat: {
    channelId: number, 
    identity: string,
    avatar: string
  }
  group_edit: {
    groupId: number
  }
  profile_others: {
    groupUserName: string
  }
}

const Tab = createBottomTabNavigator<TabNavigatorParamList>()

function TabBarIcon(props: { name: React.ComponentProps<typeof Icons>["name"]; color: string }) {
  const iconStyle = { marginBottom: -15 }
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
        tabBarStyle: {
          backgroundColor: color.bar,
        }
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
