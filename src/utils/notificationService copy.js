import messaging from '@react-native-firebase/messaging';
import * as firebase from '@react-native-firebase/app';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Button, Alert } from "react-native";
//import PushNotification from "react-native-push-notification";
import * as Urls from '../constants/ConstantVariables/Urls';

const firebaseConfig = {
  apiKey: "AAAAUjSWSt4:APA91bHlpwBYdaQ9ZvHSpJ8cEOsQdh91d0HnxhtXbCTdMk7pYbhgCnI-oZgPymJznjAA-JhpIFHtBOMwLIL284S47y2MtQ1G-HJzolryP6GWmzUPkPKwQ_0ArBUj50uOPk5ncQcncHx9",
  //authDomain: "rawnews.firebaseapp.com",
  //databaseURL: "https://rawnews.firebaseio.com",
  projectId: "raw-news-usa",
  storageBucket: "raw-news-usa.appspot.com",
  messagingSenderId: "353069583070",
  appId: "1:353069583070:android:8957cca21f9bfc3b9c104f",
  //measurementId: "G-measurement-id",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
//firebase.apps.length === 0 ? firebase.app() : firebase.initializeApp(firebaseConfig);

export async function requestUserPermission(userId) {
//console.log("user id -->"+userId + JSON.stringify(firebaseApp));

  const authStatus = await messaging().requestPermission();

// user doesn't have permission
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken(userId);
  }
  else{
    console.log('firebase says user does not have notification permission')
// user doesn't have permission
  }
}
const getFcmToken = async (userId) => {
  
  let fcmToken = null
  try{
    fcmToken = await messaging().getToken();
    console.log(`Try block execute`)
  }catch(error) {
    console.log(`Error in FCM: ${error}`)
  }
  console.log(`FCM Token Generate: ${fcmToken}`)
  if (fcmToken) {
   // console.log(fcmToken, "-->new version")
   //  await AsyncStorage.setItem('fcmToken', fcmToken);
   console.log(`New FCM Token: ${fcmToken}`)
   //let userToken = 'AAAA6icmZjQ:APA91bFSjyxONah1LLkwTC8nUccJTTcxv70WGMvYADja6igtzY-h6-6C32oakW_TdaIhIVTK6jAFTv_ShhBEHIRQ2D9uWZKTm3OpGdhTrl9dcBB6WzC1fmZ23M383GMHT0o8Lfoe7q1U';
   let userToken = 'AAAAUjSWSt4:APA91bHlpwBYdaQ9ZvHSpJ8cEOsQdh91d0HnxhtXbCTdMk7pYbhgCnI-oZgPymJznjAA-JhpIFHtBOMwLIL284S47y2MtQ1G-HJzolryP6GWmzUPkPKwQ_0ArBUj50uOPk5ncQcncHx9';
   
     if(fcmToken){
      console.log("api push"+Urls.pushNotificationDetails+'?data={"data":{"fcmToken":"'+fcmToken+'", "userId":"'+userId+'", "serverKey":"'+userToken);
      fetch(Urls.pushNotificationDetails+'?data={"data":{"fcmToken":"'+fcmToken+'", "userId":"'+userId+'", "serverKey":"'+userToken+'"}}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
         .then(response => response.json())
         .then(responseJson => {
          //  console.log('Success1:', JSON.stringify(responseJson));
          //  let dataToSend={
          //   to: fcmToken,
          //    notification: {
          //      body: "Check Details Post here",
          //      title: "New Post Added in Your Locality",
          //      subtitle: "Post Details"
          //    }
          // };
      //     console.log(dataToSend);
      //     fetch('https://fcm.googleapis.com/fcm/send', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `key= ${userToken}`,
      //     },
      //     body: JSON.stringify(dataToSend),
      //   })
      //     .then(response => response.json())
      //     .then(responseJson => {
      //       console.log('Success1:', JSON.stringify(responseJson));
      //       if (responseJson.success) {
      //         console.log('Success2:');         
      //       } else {
      //         alert(responseJson.message);
      //       }
      //     })
      //  .catch(error => {
      //    console.error('Error:', error);
      //  });
         })
         .catch(error => {
           console.error('Error:', error);
         });
     }
    //  fetch('https://fcm.googleapis.com/fcm/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `key= ${userToken}`,
    //   },
    //   body: JSON.stringify(dataToSend),
    //  })
    //    .then(response => response.json())
    //    .then(responseJson => {
    //      console.log('Success1:', JSON.stringify(responseJson));
    //     //  if (responseJson.success) {
    //     //    console.log('Success2:');         
    //     //  } else {
    //     //    alert(responseJson.message);
    //     //  }
    //    })
    //    .catch(error => {
    //      console.error('Error:', error);
    //    });
   }
}

export const notificationListener = async (navigation) => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log("recevied in background App", remoteMessage)
    let newsTd = remoteMessage.data.newsID;
    navigation.navigate('NewsDetailsScreen', { itemId: newsTd, flag: 'news'});
   //Alert.alert('Notification',remoteMessage.notification.title +'\n'+ remoteMessage.notification.body);
    
  });
  messaging().onMessage(async remoteMessage => {
   
   console.log("recevied in foreground", remoteMessage);
 let newsTd = remoteMessage.data.newsID;
 navigation.navigate('NewsDetailsScreen', { itemId: newsTd, flag: 'news'});
   //Alert.alert('Notification',remoteMessage.notification.title +'\n'+ remoteMessage.notification.body);

  });
  // Register background handler
//messaging().setBackgroundMessageHandler(async (remoteMessage,navigation) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
  
 console.log("background ---"+JSON.stringify(remoteMessage));
 //Alert.alert('Notification',remoteMessage.notification.title +'\n'+ remoteMessage.notification.body);
 //let newsTd = remoteMessage.data.newsID;
 //navigation.navigate('NewsDetailsScreen', { itemId: newsTd, flag: 'news'});
  
});
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // let notificationData = JSON.parse(remoteMessage.notification.body);
        console.log('Notification caused app to open from quit state:',remoteMessage);
        let newsTd = remoteMessage.data.newsID;
        navigation.navigate('NewsDetailsScreen', { itemId: newsTd, flag: 'news'});
        //Alert.alert('Notification',remoteMessage.notification.title +'\n'+ remoteMessage.notification.body);
      }
      
  });
}
