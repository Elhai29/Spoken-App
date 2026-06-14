import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import ParticipantsScreen from './ParticipantsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const [userName, setUserName] = useState('אלחי');

  return (
    <SafeAreaProvider> 
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={({ navigation }) => ({
            drawerPosition: 'right', 
            headerTitleAlign: 'center',
            
            headerRight: () => (
              <TouchableOpacity 
                style={{ marginRight: 20 }} 
                onPress={() => navigation.toggleDrawer()}
              >
                <MaterialCommunityIcons name="menu" size={32} color="#1A1A1A" />
              </TouchableOpacity>
            ),
            
            headerLeft: () => null, 

            // כאן התיקון: הסרנו את ה-row-reverse שגרם לטקסט להעלם
            drawerLabelStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'right', // שומר על הטקסט צמוד לימין
            },
            drawerActiveTintColor: '#D32F2F',
          })}
        >
          
          <Drawer.Screen 
            name="Home" 
            options={{ 
              title: 'מסך ראשי',
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              )
            }}
          >
            {() => <HomeScreen userName={userName} />}
          </Drawer.Screen>

          <Drawer.Screen 
            name="Participants" 
            options={{ 
              title: 'רשימת משתתפים',
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-music" size={size} color={color} />
              )
            }}
          >
            {() => <ParticipantsScreen userName={userName} />}
          </Drawer.Screen>

        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}