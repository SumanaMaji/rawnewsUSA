import React from 'react';

// Import Navigators from React Navigation

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import ExclusiveNewsScreen from '../screens/ExclusiveNewsScreen/ExclusiveNewsScreen';
import NewsDetailsScreen from '../screens/NewsDetailsScreen/NewsDetailsScreen';
import AuthorDetailsScreen from '../screens/AuthorDetailsScreen/AuthorDetailsScreen';
import AdDetailsScreen from '../screens/AdDetailsScreen/AdDetailsScreen';
import NewsAddScreen from '../screens/NewsAddScreens/NewsAddScreen';
import PlaceYourAdScreen from '../screens/PlaceYourAdScreen/PlaceYourAdScreen';
import GattingPaidUserScreen from '../screens/GattingPaidUserScreen/GattingPaidUserScreen';
import InviteFriendScreen from '../screens/InviteFriendScreen/InviteFriendScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import CustomSidebarMenu from '../Components/CustomSidebarMenu';
import NavigationDrawerHeader from '../Components/NavigationDrawerHeader';
import {CustomColors} from '../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchAds from '../Components/SearchAds';
import AdListScreen from '../screens/AdDetailsScreen/AdListScreen';
import ContactUsScreen from '../screens/ContactUsScreen/ContactUsScreen';
import AppPrivacyScreen from '../screens/AppPrivacyScreen/AppPrivacyScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen/DeleteAccountScreen';
import ResetPasswordScreen from '../screens/ForgotPasswordScreens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const exclusiveNewsStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ExclusiveNewsScreen">
      <Stack.Screen
        name="ExclusiveNewsScreen"
        component={ExclusiveNewsScreen}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
              <SearchAds navigation={navigation}  />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen name={'AdListScreen'} component={AdListScreen}
      options={{
        title: 'Advertiser', //Set Header Title
      }} />
    </Stack.Navigator>
  );
};
const addNewsStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="NewsAddScreen">
      <Stack.Screen
        name="NewsAddScreen"
        component={NewsAddScreen}
        options={{
          title: 'Add Content', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const invideFriendStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="InviteFriendScreen">
      <Stack.Screen
        name="InviteFriendScreen"
        component={InviteFriendScreen}
        options={{
          title: 'Invite Friend', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const placeYourAdStace = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="PlaceYourAdScreen">
      <Stack.Screen
        name="PlaceYourAdScreen"
        component={PlaceYourAdScreen}
        options={{
          title: 'Place Your Ad', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const adListStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="AdListScreen">
      <Stack.Screen
        name="AdListScreen"
        component={AdListScreen}
        options={{
          title: 'Advertiser', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}; 
const gettingPaidStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="GattingPaidUserScreen">
      <Stack.Screen
        name="GattingPaidUserScreen"
        component={GattingPaidUserScreen}
        options={{
          title: 'Getting Paid', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}; 

const settingsStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="SettingsScreen">
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}; 
const resetpasswordStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ResetPasswordScreen">
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          title: 'Change Password', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}; 
const contactusStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ContactUsScreen">
      <Stack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{
          title: 'Contact Us', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const appprivacyStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="AppPrivacyScreen">
      <Stack.Screen
        name="AppPrivacyScreen"
        component={AppPrivacyScreen}
        options={{
          title: 'App Privacy', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const accountdeleteStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="DeleteAccountScreen">
      <Stack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
        options={{
          title: 'Delete your account', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: CustomColors.blue, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const NewsDetailsScreentack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="NewsDetailsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: CustomColors.blue, //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="NewsDetailsScreen"
        component={NewsDetailsScreen}
        options={{
          title: 'News Details', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const AuthorDetailsScreentack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="AuthorDetailsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: CustomColors.blue, //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="AuthorDetailsScreen"
        component={AuthorDetailsScreen}
        options={{
          title: 'Author Details', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};        
const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
    screenOptions={{
        color: CustomColors.blue,
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: CustomColors.white,
        },
        headerShown: false,
        drawerActiveBackgroundColor: CustomColors.blue,
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'black',
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="exclusiveNewsStack"
        options={{drawerLabel: 'Exclusive News',
        drawerIcon: ({focused, size}) => (
          <FontAwesome
             name="info-circle"
             size={size}
             color={focused ? '#7cc' : '#fff'}
          />
       )}}
        component={exclusiveNewsStack}
      />
      <Drawer.Screen
      name="addNewsStack"
      options={{drawerLabel: 'Add Content',
      drawerIcon: ({focused, size}) => (
        <FontAwesome
           name="plus-square"
           size={size}
           color={focused ? '#7cc' : '#fff'}
        />
     )}}
      component={addNewsStack}
    />
    
  <Drawer.Screen
  name="placeYourAdStace"
  options={{drawerLabel: 'Place Your Ad',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={placeYourAdStace}
/>

<Drawer.Screen
  name="adListStack"
  options={{drawerLabel: 'Advertiser',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={adListStack}
/>
  
  <Drawer.Screen
  name="gettingPaidStack"
  options={{drawerLabel: 'Getting Paid To Upload Articles/Video',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={gettingPaidStack}
/>
  <Drawer.Screen
  name="settingsStack"
  options={{drawerLabel: 'Settings',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={settingsStack}
/>
<Drawer.Screen
  name="resetpasswordStack"
  options={{drawerLabel: 'Change Password',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={resetpasswordStack}
/>
  <Drawer.Screen
  name="contactusStack"
  options={{drawerLabel: 'Contact Us',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={contactusStack}
/>
  <Drawer.Screen
  name="appprivacyStack"
  options={{drawerLabel: 'App Privacy',
  drawerIcon: ({focused, size}) => (
    <FontAwesome
       name="plus-square"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={appprivacyStack}
/>
<Drawer.Screen
  name="accountdeleteStack"
  options={{drawerLabel: 'Delete your account',
  drawerIcon: ({focused, size}) => (
    <MaterialCommunityIcons
       name="delete-circle"
       size={size}
       color={focused ? '#7cc' : '#fff'}
    />
 )}}
  component={accountdeleteStack}
/>    
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;