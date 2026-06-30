import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#2a2a2a',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#f7931a',
        tabBarInactiveTintColor: '#555555',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transferts',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚡" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Épargne',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎯" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cashu"
        options={{
          title: 'Cashu',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📦" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
