import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Platform } from 'react-native';
import NativeModuleScreen from '../screen/NativeModuleScreen';
import UIExamScreen from '../screen/UIExamScreen';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="UI EXAM"
      screenOptions={{
        headerStyle: {
          height: Platform.OS === 'ios' ? 60 : 80,  
        },
        headerStatusBarHeight: Platform.OS === 'ios' ? 8 : undefined,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
        }
      }}
    >
      <Drawer.Screen name="UI EXAM" component={UIExamScreen} />
      <Drawer.Screen name="NATIVE MODULE EXAM" component={NativeModuleScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;