// Import React and Component
import React, {useState, useEffect} from 'react'; 
import {TouchableOpacity, View, StyleSheet, Image,Text,Alert,Linking} from 'react-native';
import Video from 'react-native-video';
import * as Urls from '../../constants/ConstantVariables/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IntroVideoScreen = ({navigation}) => {

  const [userLocation, setUserLocation] = useState();
  const [introImage,setIntroImage] = useState('https://bluebookblacknews.com/bluebook/admin/images/intro/videoImage/blue-intro-thumb-62ba1f193f5e3.png');
  const [introVideo, setIntroVideo] = useState();
  const [learnMoreLink, setLearnMoreLink] = useState("http://raise-my-credit-score.com/free-credit-score-tik-tok/");
 
  useEffect(() => {
    getIntroVideoData();
  }, [introVideo]);

  const getIntroVideoData = () => {
    fetch(Urls.introVideo, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          //console.log(JSON.stringify(responseJson))
          let data = responseJson.data.aditems[0];
          setIntroImage(data.video_image);
          setIntroVideo(data.filename);
          setLearnMoreLink(data.learn_more_url);
          //setLoading(false);
        } else {
          console.log('user data not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
 const showVideo = () => {
   Alert.alert("img");
   findCoordinates();
 }
 const learnMore = () => {
    navigation.replace('DrawerNavigationRoutes');
 }
 const skipAd = () =>{
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
    <View style={styles.container}>
      <Video source={{uri: introVideo}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       onBuffer={onBuffer}                // Callback when remote video is buffering
       onError={videoError}               // Callback when video cannot be loaded 
       resizeMode={"cover"}
       style={styles.backgroundImage} />
      
      <View style={ styles.learnMore }>
        <TouchableOpacity onPress={() => learnMore()}>
          <Text style={styles.skipIntroText}>SKIP Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroVideoScreen;

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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "stretch",
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
      top: 80,
      bottom: 0,
      left: '75%',
      right: 20, 
  },
  skipIntroText: {
    backgroundColor: '#07aaf5',
    color: 'white',
    padding: 10,
    fontSize:15,
  },
});
