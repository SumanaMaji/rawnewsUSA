import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Modal,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Urls from '../../constants/ConstantVariables/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExclusiveNewsCard(props) {
  const [nNumber, setNNumber] = useState(0);
  const [adsImage, setAdsImage] = useState('');
  const [adsId, setAdsId] = useState();
  const [userLatitude, setUserLatitude] = useState('');
  const [userLongitude, setUserLongitude] = useState('');
  useEffect(() => {
    getAds();
    readUserLatitude('user_latitude');
    readUserLongitude('user_longitude');
    //console.log(props);

    let smallImage = props.data.news_image;
  }, [userLatitude,userLongitude]);
  const readUserLatitude = async user_longitude => {
    try {
      const user_longitude1 = await AsyncStorage.getItem(user_longitude);
      if (user_longitude1 !== null) {
        setUserLatitude(user_longitude1);
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
  const getAds = () => {
       //fetch(Urls.randomAds, {
        fetch(Urls.randomAds+'?data={"data":{"lattitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        })
          .then(response => response.json())
          .then(responseJson => {       // alert(Urls.randomAds+'?data={"data":{"lattitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}');
         //alert(responseJson.data.data.advertisername);
            if (responseJson.error == 0) {
            setAdsImage(responseJson.data.data.small_banner_image);
              setAdsId(responseJson.data.data.id);
            } else {
              console.log('Please check your user name or password');
            }
          })
          .catch(error => {
            console.error(error);
          });
  }
 
  const renderBannerImage = (imageSource) => {

    if(imageSource != '')
    {
      return (<Image
                resizeMode='contain'
                source={{
                  uri: imageSource,
                  }}
                style={styles.adImg}
              />);
    }
  }
  const renderImage = (imageSource) => {

    if(imageSource != '')
    {
      return (<Image
                resizeMode='contain'
                source={{
                uri: imageSource,
                }}
                style={styles.mainImg}
            />);
    }
    else{
      return (
        <Image
        resizeMode='contain'
          source={require('../../assets/images/logo.jpg')}
          style={styles.mainImgNoImage}
          />
      );
    }
  }
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
//console.log(props.datakey);//setNNumber(nNumber+1);
  return (
    <TouchableOpacity 
    onPress={() => props.goToNewsDetailsHandler(props.data.id,props.data.flag)}>
      <View style={styles.maincard}>
        
      <View style={styles.cardnew}>
        <View style={styles.cardleft}>
          <View style={styles.cardinner}>
            <Text style={styles.cardhead}>{props.data.title}</Text>
            <View style={styles.cardheadAuther}>
            <TouchableOpacity onPress={() => props.goToNewAutherHandler(props.data.author)}>
              <Text style={styles.cardhead}>By {props.data.author}</Text>
            </TouchableOpacity>
          </View>
          </View>
          {
              (props.data.mediatype == "I")? (
                renderImage(props.data.news_image)
              ) : (
                renderImage(props.data.videoimage)
              )        
          }       
          <View style={styles.cardinnerData}>
          <Text style={styles.cardtext}>{props.data.content} </Text>        
          </View>
         
          <View style={styles.lcd}>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="thumbs-up" size={17} /> Like</Text>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="comment" size={17} /> Comment</Text>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="share" size={17} /> Share</Text>
          </View>
        </View>
     
      </View>
      {
        ((props.datakey+1)%3==0)? (
          
          <TouchableOpacity onPress={() => props.goToAdDetailsHandler(adsId)} style={styles.adImgbox}>
            {
              renderBannerImage(adsImage)
            }
          
        </TouchableOpacity>
        ) : null
      }
      
      
    </View>
    </TouchableOpacity>
    
  );
}
const styles = StyleSheet.create({
  iconclr: {
  
    color: '#000',
 
  },

  mainImg: {
    flex: 1,
    width: '100%',
    
    aspectRatio: 16/9,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#000",
  },
  mainImgNoImage: {
    flex: 1,
    width: '100%',
    height: 220,
    
    aspectRatio: 16/9,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#000",
  },
  lcd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:5,
    marginTop: -25,
  },

  location: {
    flexDirection: 'row',
    justifyContent:'space-around',
    alignContent: 'stretch',
    padding: 5,
  },
  locationext: {
     width:'100%',
     textAlign:'left',
     fontSize:18,
     marginLeft: 20,
  },
  temparaturess: {
    
    marginRight: 20,
    fontWeight: 'bold',
    fontSize:24,
  },
  maincard: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },

  cardview: {
    borderWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    width: '95%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
    shadowColor: '#cbcbcb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 2,  
    elevation: 5,
  },
  cardnew: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f0f0f0',
    width: '95%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
    shadowColor: '#d9d9d9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5
  },
  cardleft: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  cardright: {
    
    
  },
  cardinner: {
    marginTop: 2,
    padding: 3,
  },
  cardinnerData: {
    marginTop: -20,
    marginBottom: 20,
  },
  cardhead: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
  },
  
  cardheadAuther: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    alignItems:'flex-end',
    marginTop: 0,
    marginBottom: 0,
  },
  cardtext: {
    color: '#333',
    fontSize: 20,
    marginBottom: 20,
  },
  cardimagediv: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  cardimage: {
    backgroundColor: '#ccc',
    height: 35,
    width: 35,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  btnContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitbtn: {
    height: 55,
    width: 150,
    backgroundColor: '#0cb318',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonClose: {
    height: 55,
    width: 150,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 15,
  },
  textStyle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop:30
  },
  adImg: {
    width: '90%',
    height:75,
  },
  adImgbox: {
    width: '100%',
    height:75,
    marginBottom: 10,
    marginTop:15,
    alignItems:'center',
    
  }
  
});
