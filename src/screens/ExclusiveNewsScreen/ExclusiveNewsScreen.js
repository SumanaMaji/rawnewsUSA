import React, {useState, useEffect, createRef} from 'react';
import {StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl, Alert,Linking, Platform, PermissionsAndroid, TouchableOpacity} from 'react-native';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
import ExclusiveNewsCard from '../../Components/News/ExclusiveNewsCard';
import * as Urls from '../../constants/ConstantVariables/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader/Loader';
import { cos } from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';

import {requestUserPermission, notificationListener} from "../../utils/notificationService";


const initialState = { offset: 0};
const ExclusiveNewsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isFirst, setIsFirst] =useState(false);
  const [userId, setUserId] = useState();
  const [userLatitude, setUserLatitude] = useState('');
  const [userLongitude, setUserLongitude] = useState('');
  const [userTemp, setUserTemp] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userDate, setUserDate] = useState('');
  const [onEndReached, setOnEndReached] = useState(false);
  const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true)
  useEffect(() => {
    getUserLatestLocation();
    readUserId('user_id');
    readUserLatitude('user_latitude');
    readUserLongitude('user_longitude');
    getUserLocation();
    getData(1);
   requestUserPermission(userId);
    notificationListener(navigation);
  }, [userId,userLatitude,userLongitude]);
  console.log('locc'+userLatitude+''+userLongitude+"userId--"+userId);
  
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
  const getUserLatestLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    if (hasPermission) {
      Geolocation.getCurrentPosition(
          (position) => {
           //console.log(position.coords.latitude);
            //console.log(position.coords.longitude);
            AsyncStorage.setItem('user_latitude', JSON.stringify(position.coords.latitude));
            setUserLatitude(JSON.stringify(position.coords.latitude));
            AsyncStorage.setItem('user_longitude', JSON.stringify(position.coords.longitude));
            setUserLongitude(JSON.stringify(position.coords.longitude));
            getUserLocation();
            getData(1);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }
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
     const getUserLocation = () => {
       //console.log(userLatitude+"->"+userLongitude)
       //alert(userLatitude);
       //alert(userLongitude);
       if(userLatitude && userLongitude)
       {
          fetch(Urls.temprature+'?data={"data":{"lattitude":"'+userLatitude+'", "longitude":"'+userLongitude+'"}}', {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.error == 0) {
              setUserTemp(responseJson.data1.temp);
              console.log(responseJson.data4.country);   
              setUserLocation(responseJson.data2.name);
              setUserDate(responseJson.data3.date);
              /*alert('Lattitude ->'+userLatitude+
              '\nLongitude->'+userLongitude+
              '\nLocation Name->'+responseJson.data2.name
              );
              */
              if(responseJson.data4.country == 'IN' || responseJson.data4.country == 'US')
              {
                setUserCountry(responseJson.data4.country);
              }
              else
              {
                setUserCountry('');
               // alert("Sorry! App is unavailabe for this country");
               // navigation.replace('SplashScreen');
              }
              setLoading(false);
            } else {
              console.log('Please check your user name or password');
            }
          })
          .catch(error => {
            console.error(error);
          });
        //navigation.replace('SplashScreen');
       }
     }
    const getData =  async (offset) => {
    setLoading(true);
    //console.log("userid---->"+userId);
   // requestUserPermission(userId);
   // notificationListener();
     await fetch(Urls.getExclusiveNews+'?data={"data":{"page":"'+(offset)+'"}}', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
       // alert(JSON.stringify(responseJson));
        if (responseJson.error == 0) {
          let data = responseJson.data.news;
          setLoading(false);
          setIsRefreshing(false);
          if(offset==1)
          {
            setTableData(data);
          }
          else{
            Array.prototype.push.apply(tableData,data); 
            setTableData(tableData);
          }
          //console.log(tableData)
         // setLoading(false);
        } else {
          setLoading(false);
          console.log('Please check your user name or password');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };
  const gotToDetails = (id,flag) => {
    //navigation.navigate('LoginScreen');
   if(userId != null)
  {
        navigation.navigate('NewsDetailsScreen', { itemId: id, flag: flag});
  }
  else
   {
      navigation.navigate('LoginScreen');
   }
    //console.log(id);
    
  };
  const goToAdDetails = id => {
    fetch(Urls.getAdsClick+'?data={"data":{"business_id":"'+id+'", "userId":"'+userId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("addsdetailsviews--"+responseJson);
        if (responseJson.error == 0) {
          let data = responseJson.data.click;
          console.log(JSON.stringify(data));
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
    navigation.navigate('AdDetailsScreen', { itemId: id, });
  }
  const goToNewsAuthor = () => {
    navigation.navigate('ContactUsScreen');
  }
  const goToContactUs = () => {
    navigation.navigate('ContactUsScreen');
  }
  const lodeMoreData = () => {
    if(!loading)
    {
      setOffset(offset+1);
      getData(offset+1);
      //setLoading(true)
    }
    
    
   // alert("loadmore"+offset);
  }
  const refreshData =  () => {
    setIsRefreshing(true);
    setOffset(1);
    getData(1);
   // alert("refre"+offset);
  }
  const myKeyExtractor = (index) => {
   // console.log("dee->"+index);
    return index.toString();
  }
  const renderFooter = () => {
    //console.log(loading)
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
     if (!loading) {return null;}
     return (
       <ActivityIndicator
         style={{ color: '#000' }}
       />
     );
   };
   const renderSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: '100%',
          backgroundColor: '#CED0CE'
        }}
      />
    );
   }
  return (
 
      
    <View style={styles.container}>
    {
        (userTemp != '') ?
        (
          <View style={styles.cardview}>
          <View style={styles.cardleft}>
          <View style={styles.cardinner}>
          <View style={styles.location}>
              <Text style={styles.locationext}>{userDate}{"\n"}{userLocation}</Text>
              <Text style={styles.temparaturess}>{userTemp}&deg; F</Text>
              <View style={styles.temparaturess}>
              <TouchableOpacity onPress={() => getUserLatestLocation()}>
                <Text style={styles.refresh}>{"\n"}Refresh</Text>
              </TouchableOpacity>
              </View>
            </View>
              
            </View>
          </View>  
          
        </View>
        ) : null
      }
      {
        (loading && offset ===1) ?
        (
           <View style={{
            width: '100%',
            height: '100%'
          }}><ActivityIndicator style={{ color: '#000' }} /></View>
        ) : null
      }
      
      <FlatList
          style={styles.flatListStyle}
          showsVerticalScrollIndicator={false}
          data={tableData}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <ExclusiveNewsCard data={item} goToNewAutherHandler={goToNewsAuthor} goToNewsDetailsHandler={gotToDetails} goToAdDetailsHandler={goToAdDetails} datakey={index.toString()} ></ExclusiveNewsCard>
            );
          }}
          onEndReached={lodeMoreData}
          //onEndReachedThreshold={0}
          ListFooterComponent={renderFooter.bind(this)}
          ItemSeparatorComponent={renderSeparator}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
          }
        />
    </View>

  );
};

export default ExclusiveNewsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  btnContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#fff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  greenbutton: {
    width: 170,
    marginTop: 10,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
  },
  redbutton: {
    width: 170,
    marginTop: 10,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
  },
  closebutton: {
    backgroundColor: 'red',
    padding: 2,
    color: 'white',
    borderRadius: 100,
    position: 'absolute',
    right: 5,
    top: 5,
    marginBottom: 10,
  },
  green: {
    backgroundColor: CustomColors.green,
  },
  red: {
    backgroundColor: CustomColors.red,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  cardview: {
    borderWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
    shadowColor: '#cbcbcb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
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
    marginBottom: 2,
    padding: 5,
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
    fontSize:22,
  },
  refresh: {   
    marginRight: 20,
    fontWeight: 'bold',
    fontSize:16,
    marginTop: 5,
  },
});
