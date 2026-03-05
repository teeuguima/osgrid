import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';

import {HomeScreen} from '../screens/HomeScreen';
import {DetailsScreen} from '../screens/DetailsScreen';
import {FormScreen} from '../screens/FormScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#f4f4f4'},
          headerTintColor: '#333',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Listagem de ordens'}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: 'Detalhes'}}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={({route}) => ({
            title: route.params?.os ? 'Editar OS' : 'Nova OS',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
