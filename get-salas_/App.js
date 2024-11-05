import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import AddReservScreen from './src/AddReservationScreen';
import Reserv from './src/ReservationsScreen';
import EditReservScreen from './src/EditReservationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddReservation" component={AddReservScreen} />
        <Stack.Screen name="Reservations" component={Reserv} />
        <Stack.Screen name="EditReservation" component={EditReservScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;