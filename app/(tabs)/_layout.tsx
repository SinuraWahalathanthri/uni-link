import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
 <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
     <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#fdfdfd',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 0,
          },
          default: {
            backgroundColor: '#fdfdfd',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 0,
          },
        }),
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home-filled" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="newspaper" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Event',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat" size={28} color={color} />
          ),
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: 10,
          },
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
 </View>
  );
}
