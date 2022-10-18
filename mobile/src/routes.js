import React from 'react';
import { TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// ** Routes
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import Detail from './pages/Delivery/Detail';
import Confirm from './pages/Delivery/Confirm';
import Problems from './pages/Delivery/Problems';
import SendProblem from './pages/Delivery/SendProblem';

import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from './styles/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DeliveryRoutes = () => {
  const AddRoutesOptions = ({ navigation, title }) => ({
    title,
    headerTitleAlign: 'center',
    headerTransparent: true,
    headerTintColor: '#fff',
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="chevron-left" size={20} color="#fff" />
      </TouchableOpacity>
    ),
  });

  return (
    <Stack.Navigator
      defaultScreenOptions={{
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
      }}>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={({ navigation }) =>
          AddRoutesOptions({
            navigation,
            title: '',
          })
        }
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={({ navigation }) =>
          AddRoutesOptions({
            navigation,
            title: 'Detalhes da encomenda',
          })
        }
      />
      <Stack.Screen
        name="Confirm"
        component={Confirm}
        options={({ navigation }) =>
          AddRoutesOptions({
            navigation,
            title: 'Confirmar entrega',
          })
        }
      />
      <Stack.Screen
        name="SendProblem"
        component={SendProblem}
        options={({ navigation }) =>
          AddRoutesOptions({
            navigation,
            title: 'Informar problema',
          })
        }
      />
      <Stack.Screen
        name="Problems"
        component={Problems}
        options={({ navigation }) =>
          AddRoutesOptions({
            navigation,
            title: 'Visualizar problemas',
          })
        }
      />
    </Stack.Navigator>
  );
};

const Routes = ({ signed = false }) => {
  return (
    <NavigationContainer>
      {signed ? (
        <>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarVisible: false,
              headerShown: false,
              tabBarHideOnKeyboard: true,
              tabBarActiveTintColor: colors.purple,
              tabBarInactiveTintColor: colors.grey1,
              tabBarActiveBackgroundColor: colors.background,
              unmountOnBlur: true,
              tabBarStyle: {
                paddingTop: 10,
                paddingBottom: 15,
                height: 65,
                backgroundColor: colors.background,
              },
            })}>
            <Tab.Screen
              name="DeliveryRoutes"
              component={DeliveryRoutes}
              options={{
                title: 'Entregas',
                tabBarIcon: ({ color }) => (
                  <Icon name="menu" size={20} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                title: 'Meu perfil',
                tabBarIcon: ({ color }) => (
                  <Icon name="account-circle" size={20} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;
