import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import AdmissionScreen from '../screens/admission/AdmissionScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import FormStepScreen from '../screens/admission/FormStepScreen';
import ApplicationViewScreen from '../screens/admission/ApplicationViewScreen';
import { getDisplayStep } from '../utils/stepUtils';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdmissionStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AdmissionMain" 
      component={AdmissionScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="FormStep" 
      component={FormStepScreen}
      options={({ route }: any) => ({
        title: `Step ${getDisplayStep(route.params?.step || 1)}`
      })}
    />
    <Stack.Screen 
      name="ApplicationView" 
      component={ApplicationViewScreen}
      options={{ title: 'Application Details' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Admission"
        component={AdmissionStack}
        options={{
          tabBarLabel: t('tabs.admission'),
          tabBarIcon: ({ color }) => <Icon name="school" size={24} color={color} />,
          // headerShown: false,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: t('tabs.explore'),
          tabBarIcon: ({ color }) => <Icon name="explore" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color }) => <Icon name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loadAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadAuth();
      } catch (error) {
        console.error('Failed to load auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [loadAuth]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
