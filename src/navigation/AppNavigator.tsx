import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';

import {HomeScreen} from '../screens/HomeScreen';
import {DetailsOSScreen} from '../screens/DetailsOSScreen';
import {RegisterOSScreen} from '../screens/RegisterOSScreen';
import {theme} from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: theme.colors.background},
          headerTintColor: theme.colors.text.main,
          headerTitleStyle: {fontWeight: 'bold'},
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Details"
          component={DetailsOSScreen}
          options={{title: 'Detalhes'}}
        />

        <Stack.Screen
          name="Form"
          component={RegisterOSScreen}
          options={({route}) => ({
            title: route.params?.osId ? 'Editar OS' : 'Nova OS',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
