import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetScreen from './screens/ResetScreen';
import DashboardScreen from './screens/DashboardScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddItemScreen from './screens/AddItemScreen';
import SearchResultScreen from './screens/SearchResultScreen';
import ItemInfoScreen from './screens/ItemInfoScreen';
import EditScreen from './screens/EditScreen';
import ScanQrScreen from './screens/ScanQrScreen';
import ItemAfterEditScreen from './screens/ItemAfterEditScreen';
import AddItemQrScreen from './screens/AddItemQrScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown: false}}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ResetScreen" component={ResetScreen} options={{headerShown: false}}/>
        <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} options={{headerShown: false}}/>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name="AddItemScreen" component={AddItemScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ItemInfoScreen" component={ItemInfoScreen} options={{headerShown: false}}/>
        <Stack.Screen name="EditScreen" component={EditScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ScanQrScreen" component={ScanQrScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ItemAfterEditScreen" component={ItemAfterEditScreen} options={{headerShown: false}}/>
        <Stack.Screen name="AddItemQrScreen" component={AddItemQrScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
