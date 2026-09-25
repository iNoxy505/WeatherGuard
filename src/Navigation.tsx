import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from './state/useAuthStore';
import { WeatherIcon } from './components/WeatherIcon';
import { Colors, FontSize, Spacing } from './theme/colors';

// Auth screens
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignUpScreen } from './screens/auth/SignUpScreen';

// Main screens
import { DashboardScreen } from './screens/home/DashboardScreen';
import { AlertsScreen } from './screens/alerts/AlertsScreen';
import { AlertDetailScreen } from './screens/alerts/AlertDetailScreen';
import { MapViewScreen } from './screens/map/MapViewScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { SettingsScreen } from './screens/profile/SettingsScreen';
import { EditProfileScreen } from './screens/profile/EditProfileScreen';
import { RiskScoreScreen } from './screens/risk/RiskScoreScreen';
import { SOSScreen } from './screens/emergency/SOSScreen';

// Types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  RiskScore: undefined;
  AlertDetail: { alertId: string };
  Settings: undefined;
  EditProfile: undefined;
  Emergency: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  AlertsTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Dark theme for NavigationContainer
const DarkNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.accent.cyan,
    background: Colors.bg.primary,
    card: Colors.bg.secondary,
    text: Colors.text.primary,
    border: Colors.border.subtle,
    notification: Colors.accent.amber,
  },
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg.secondary,
          borderTopColor: Colors.border.subtle,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: Colors.accent.cyan,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <WeatherIcon name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="AlertsTab"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color }) => <WeatherIcon name="bell" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapViewScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => <WeatherIcon name="map" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <WeatherIcon name="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg.secondary },
        headerTitleStyle: { fontWeight: '700', color: Colors.text.primary, fontSize: FontSize.lg },
        headerTintColor: Colors.accent.cyan,
        headerShadowVisible: false,
      }}
    >
      <RootStack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="RiskScore"
        component={RiskScoreScreen}
        options={{ title: 'Safety Breakdown' }}
      />
      <RootStack.Screen
        name="AlertDetail"
        component={AlertDetailScreen}
        options={{ title: 'Alert Details' }}
      />
      <RootStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <RootStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <RootStack.Screen
        name="Emergency"
        component={SOSScreen}
        options={{ title: 'Emergency SOS', headerShown: false }}
      />
    </RootStack.Navigator>
  );
}

export function Navigation() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer theme={DarkNavTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}