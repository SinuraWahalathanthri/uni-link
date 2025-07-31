import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getLecturerChats } from '@/services/StorageServices';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;
      const chats = await getLecturerChats(user);

      const total = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      setTotalUnread(total);
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
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
              <MaterialCommunityIcons name="chat-processing" size={28} color={color} />
            ),
            // ✅ Show badge only if there are unread messages
            tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
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
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
