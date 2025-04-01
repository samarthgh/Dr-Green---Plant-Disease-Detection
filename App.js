import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

import LandingScreen from './app/screens/LandingScreen';
import ResultsScreen from './app/screens/ResultsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true, // make header background transparent to show our blur view
            headerBackground: () => (
              <BlurView
                tint="light" // you can choose "light", "dark", or "default"
                intensity={15} // adjust intensity for your desired blur effect
                style={{ flex: 1 }}
              />
            ),
            headerTintColor: 'beige', // Back button and header text color
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Landing" 
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{ title: 'Diagnosis Results' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
