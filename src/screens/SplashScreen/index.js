// Import React and Component
import React, {useState, useEffect} from 'react'; 
import {TouchableOpacity, View, StyleSheet, Image,Text,Alert,Linking, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenRoot from  "react-native-splash-screen";
import * as Urls from '../../constants/ConstantVariables/Urls';
import Video from 'react-native-video';
import Loader from '../../Components/Loader/Loader';

const SplashScreen = ({navigation}) => {

  const [loading,setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState();
  const [introImage,setIntroImage] = useState();
  const [introVideo, setIntroVideo] = useState();
  const [learnMoreLink, setLearnMoreLink] = useState();
  const [introVideoId, setIntroVideoId] = useState();
  const [userId, setUserId] = useState();
  const [userLatitude, setUserLatitude] = useState('');
  const [userLongitude, setUserLongitude] = useState('');

  useEffect(() => {
    readUserId('user_id');
    readUserLatitude('user_latitude');
    readUserLongitude('user_longitude');
    getUserLocation();
    getIntroVideoData();
   
   // getUserLocation();
    //requestUserPermission();
    //notificationListener();
  }, [userId, userLocation, userLatitude,userLongitude]);

  console.log('introv'+ userLatitude +''+ userLongitude + ''+ userLocation + 'id----'+ userId);

  const readUserId = async user_id => {
    try {
      const userId1 = await AsyncStorage.getItem(user_id);
      if (userId1 !== null) {
        setUserId(userId1);
       }
     } catch (e) {
       alert('Failed to fetch the data from storage');
     }
   };

  const getIntroVideoData = () => {
     //Show Loader
     setLoading(true);

    // fetch(Urls.introVideo, {
    //   method: 'GET',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //   }),
    // })
    console.log(Urls.introVideo+'?data={"data":{"latitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}');
   // alert(userLatitude);
   // alert(userLongitude);
    if(userLatitude & userLongitude) 
    {
      //fetch(Urls.introVideo+'?data={"data":{"latitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}', {
        fetch(Urls.introVideoDefault+'?data={"data":{"latitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          setLoading(false);
          console.log("introShow"+JSON.stringify(responseJson))
          let data = responseJson.data.aditems[0];
          if(data)
          {
            //console.log(JSON.stringify(data.video_image));
            setIntroImage(data.video_image);
            setIntroVideo(data.filename);
            setLearnMoreLink(data.learn_more_url);
            setIntroVideoId(data.id);
            console.log("video-id"+data.id +'---'+userId)
            fetch(Urls.introVideoClick+'?data={"data":{"impressions":"'+1+'", "intro_video_id":"'+data.id+'", "userId":"'+userId+'"}}', {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            })
              .then(response => response.json())
              .then(responseJsonData => {
                console.log("impressions11"+Urls.introVideoClick+'?data={"data":{"impressions":"'+1+'", "intro_video_id":"'+data.id+'", "userId":"'+userId);
               console.log("impressions"+ JSON.stringify(responseJsonData));
                if (responseJsonData.error == 0) {
                  let data = responseJsonData.data.intro;
                  setLoading(false);
                  //console.log("introvideoLoc-->"+ user_latitude + userLocation + data);
                } else {
                  setLoading(false);
                  console.log('Please check your user name or password');
                }
              })
              .catch(error => {
                setLoading(false);
                console.error(error);
              });
          }   
        } else {
          setLoading(false);
          console.log('user data not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
   else
   {
      //fetch(Urls.introVideoDefault+'?data={"data":{"latitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}', {
      fetch(Urls.introVideo, {  
      method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })  
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          setLoading(false);
          console.log("introShow"+JSON.stringify(responseJson))
          let data = responseJson.data.aditems[0];
          if(data)
          {
            //console.log(JSON.stringify(data.video_image));
            setIntroImage(data.video_image);
            setIntroVideo(data.filename);
            setLearnMoreLink(data.learn_more_url);
            setIntroVideoId(data.id);
            console.log("video-id"+data.id +'---'+userId)
            fetch(Urls.introVideoClick+'?data={"data":{"impressions":"'+1+'", "intro_video_id":"'+data.id+'", "userId":"'+userId+'"}}', {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            })
              .then(response => response.json())
              .then(responseJsonData => {
                console.log("impressions11"+Urls.introVideoClick+'?data={"data":{"impressions":"'+1+'", "intro_video_id":"'+data.id+'", "userId":"'+userId);
               console.log("impressions"+ JSON.stringify(responseJsonData));
                if (responseJsonData.error == 0) {
                  let data = responseJsonData.data.intro;
                  setLoading(false);
                  //console.log("introvideoLoc-->"+ user_latitude + userLocation + data);
                } else {
                  setLoading(false);
                  console.log('Please check your user name or password');
                }
              })
              .catch(error => {
                setLoading(false);
                console.error(error);
              });
          }   
        } else {
          setLoading(false);
          console.log('user data not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
     // Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };
  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  const getUserLocation = async () => {
    const hasPermission = await hasLocationPermission();
console.log("devtest")
    if (!hasPermission) {
      console.log('heloooo');
      return;
    }
    if (hasPermission) {
      Geolocation.getCurrentPosition(
          (position) => {
           console.log("corLocLattitude"+position.coords.latitude);
            console.log("corLocLong"+position.coords.longitude);
            AsyncStorage.setItem('user_latitude', JSON.stringify(position.coords.latitude));
            AsyncStorage.setItem('user_longitude', JSON.stringify(position.coords.longitude));
            // AsyncStorage.setItem('user_latitude', "22.5072749");
            // AsyncStorage.setItem('user_longitude', "88.3342896");
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }
  const readUserLatitude = async user_longitude => {
    try {
      const user_longitude1 = await AsyncStorage.getItem(user_longitude);
      if (user_longitude1 !== null) {
        setUserLatitude(user_longitude1);
        console.log("locc--"+userLatitude);
       }
       else{
        console.log('dataerror')
       }
     } catch (e) {
       alert('Failed to fetch the data from storage');
     }
   };
   const readUserLongitude = async user_latitude => {
    try {
      const user_latitude1 = await AsyncStorage.getItem(user_latitude);
      if (user_latitude1 !== null) {
        setUserLongitude(user_latitude1);
       }
     } catch (e) {
       alert('Failed to fetch the data from storage');
     }
   };
 const showVideo = () => {
   //Alert.alert("img");
   //findCoordinates();
   navigation.replace('IntroVideoScreen');
 }
//  const learnMore = () => {
//    let learnmoreLink = "http://raise-my-credit-score.com/free-credit-score-tik-tok/";
//   Linking.openURL(learnmoreLink);
//  }
const learnMore = () => {
 // alert('learn_more');
  //alert(Urls.introVideoClick+'?data={"data":{"learn_more":"'+1+'", "intro_video_id":"'+introVideoId+'"}}');
  //console.log(Urls.introVideoClick+'?data={"data":{"learn_more":"'+1+'", "intro_video_id":"'+introVideoId+'"}}');
  fetch(Urls.introVideoClick+'?data={"data":{"learn_more":"'+1+'", "intro_video_id":"'+introVideoId+'", "userId":"'+userId+'"}}', {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => response.json())
    .then(responseJson => {
     console.log(responseJson);
      if (responseJson.error == 0) {
        let data = responseJson.data.intro;
        setLoading(false);
        //setContactData(data);
        console.log("introvideo-->"+ data);
      } else {
        setLoading(false);
        console.log('Please check your user name or password');
      }
    })
    .catch(error => {
      setLoading(false);
      console.error(error);
    });
  let learnmoreLink = learnMoreLink;
 Linking.openURL(learnmoreLink);
}
 const skipAd = () =>{
  // alert('skip');
  // console.log(introVideoId);
  // alert(Urls.introVideoClick+'?data={"data":{"skip_ad":"'+1+'", "intro_video_id":"'+introVideoId+'"}}');
  // console.log(Urls.introVideoClick+'?data={"data":{"skip_ad":"'+1+'", "intro_video_id":"'+introVideoId+'"}}');
  // fetch(Urls.introVideoClick+'?data={"data":{"skip_ad":"'+1+'", "intro_video_id":"'+introVideoId+'", "userId":"'+userId+'"}}', {
  //   method: 'GET',
  //   headers: new Headers({
  //     'Content-Type': 'application/json',
  //   }),
  // })
  //   .then(response => response.json())
  //   .then(responseJson => {
  //    console.log(responseJson);
  //     if (responseJson.error == 0) {
  //       let data = responseJson.data.intro;
  //       setLoading(false);
  //       //setContactData(data);
  //       console.log("introvideo-->"+ data);
  //     } else {
  //       setLoading(false);
  //       console.log('Please check your user name or password');
  //     }
  //   })
  //   .catch(error => {
  //     setLoading(false);
  //     console.error(error);
  //   });
  navigation.replace('DrawerNavigationRoutes');
 }
 const findCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const location = JSON.stringify(position);

      setUserLocation({ location });
    },
    error => Alert.alert(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
const videoError = () => {
  console.log('error')
}
const onBuffer = () => {
  setLoading(false);
}
  return (
   (introVideo != '') ? 
    <View style={styles.container}>
    {/* <TouchableOpacity style={styles.backgroundImageTouch} onPress={() => showVideo()}>
    <Image
      source={{uri:introVideo}}
      style={styles.backgroundImage}
    />
    </TouchableOpacity> */}
    <Loader loading={loading} />
    <View style={styles.container}>
      <Video source={{uri: introVideo}}   // Can be a URL or a local file.
      //  ref={(ref) => {
      //    this.player = ref
      //  }}                                      // Store reference
       onBuffer={onBuffer}                // Callback when remote video is buffering
       onError={videoError}               // Callback when video cannot be loaded 
       resizeMode={"cover"}
       style={styles.videoContainer} />
      
      <View style={ styles.learnMore }>
        <TouchableOpacity onPress={() => learnMore()}>
          <Text style={styles.skipIntroText}>SKIP Video</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={ styles.skipIntro }>
      <TouchableOpacity onPress={() => skipAd()}>
          <Text style={styles.skipIntroText}>SKIP Intro</Text>
        </TouchableOpacity>
    </View>
    
    <View style={ styles.learnMore }>
      <TouchableOpacity onPress={() => learnMore()}>
        <Text style={styles.skipIntroText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  </View>
    :  
    <Image
    resizeMode='contain'
    source={require('../../assets/images/logo.jpg')}
    style={styles.mainImg}
  />
  //   <Image
  //   source={{uri:introImage}}
  //   style={styles.backgroundImage}
  // /> 
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  backgroundImageTouch: {
    flex: 1,
    
  },
  backgroundImage: {
    flex: 1,
    width: "100%",

    resizeMode: 'cover', // or 'stretch'
  },
  learnMore: {
    position: 'absolute',
      top: '80%',
      bottom: 0,
      left: '38%',
      right: '35%', 
  },
  skipIntro: {
      position: 'absolute',
      top: 20,
      
      right: 20, 
  },
  skipIntroText: {
    backgroundColor: '#07aaf5',
    color: 'white',
    padding: 8,
    paddingBottom:10,
    paddingTop:10,
    fontSize:15,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
  },
  mainImg: {
    width: '100%',
    height: 180,
    marginBottom: 10,
  },
});
