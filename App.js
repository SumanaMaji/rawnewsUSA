import React from 'react';
import { Provider } from "react-redux";
import Routes from './src/navigations/Routes';
import store from "./src/redux/store";
import SplashScreen from  "react-native-splash-screen";
import { BackHandler, Alert, Linking, Platform } from "react-native";
import linking from './src/linking';

const App = (navigation) => {

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want exit RAW News USA?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };
  // const  handleOpenURL = (event) => { // D
  //   navigate(event.url);
  // }
  // const navigate = (url) => { // E
  //   const { navigate } = this.props.navigation;
  //   const route = url.replace(/.*?:\/\//g, '');
  //   const id = route.match(/\/([^\/]+)\/?$/)[1];
  //   const routeName = route.split('/')[0];
  
  //   if (routeName === 'newsdetails') {
  //     const page =  navigation.navigate('NewsDetailsScreen', { itemId: itemId, flag: flag});
  //     //navigate('People', { id, name: 'chris' })
  //   };
  // }
  React.useEffect(() => {
    SplashScreen.hide();
    BackHandler.addEventListener("hardwareBackPress", backAction);
    // if (Platform.OS === 'android') {
    //   Linking.getInitialURL().then(url => {
    //     navigate(url);
    //   });
    // } else {
    //     Linking.addEventListener('url', handleOpenURL);
    //   }
  });
  
  return (
    <Provider store={store} linking={linking}>
      <Routes linking={linking} />
      </Provider>
  );
};

export default App;
