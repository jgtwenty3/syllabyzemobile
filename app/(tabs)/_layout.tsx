import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // For transparent background effect on iOS
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />, // Home icon
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={28} color={color} />, // Courses icon
        }}
      />
      <Tabs.Screen
        name="syllabi"
        options={{
          title: 'Syllabi',
          tabBarIcon: ({ color }) => <Ionicons name="document-text" size={28} color={color} />, // Syllabi icon
        }}
      />
      <Tabs.Screen
        name="studyplans"
        options={{
          title: 'Study Plans',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />, // Study Plans icon
        }}
      />
    </Tabs>
  );
}
