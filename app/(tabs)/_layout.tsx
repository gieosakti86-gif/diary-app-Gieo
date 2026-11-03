import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: '#9B988F',
        tabBarStyle: {
          height: 66,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEAE3',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jurnal',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>✎</Text>,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Cerita',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>☷</Text>,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorit',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>♥</Text>,
        }}
      />
    </Tabs>
  );
}
