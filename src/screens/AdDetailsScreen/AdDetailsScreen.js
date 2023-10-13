import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,Linking,
  Platform,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdDetailsScreen = ({route,navigation}) => {
  navigation.setOptions({
    headerTitle: 'Ads Details',
  });

  const { itemId } = route.params; 
  const [loading,setLoading] = useState(false);
  const [tableData, setTableData] = useState([ ]);
  const [userId, setUserId] = useState();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [largeImageData, setLargeImageData] = useState(null);
  const [loadingLargeImage, setLoadingLargeImage] = useState(false);
  
  useEffect(() => {
    readUserId('user_id');
    getData();
    addsViews();
  }, [userId]);

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
  const getData = () => {
    setLoading(true);
    fetch(Urls.adDetails+'?data={"data":{"id":"'+itemId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.error);
        if (responseJson.error == 0) {
          let data = responseJson.data.data;
          setTableData(data);
          setLoading(false);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const addsViews = () => {
    fetch(Urls.getAddsViewsCount+'?data={"data":{"business_id":"'+itemId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("addsviews--"+responseJson);
        if (responseJson.error == 0) {
          let data = responseJson.data;
          //alert(JSON.stringify(data))
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const goToWebsite = (val) => {
    Linking.openURL(val);
    fetch(Urls.getUrlClick+'?data={"data":{"business_id":"'+itemId+'",  "userId":"'+userId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        alert(Urls.getUrlClick+'?data={"data":{"business_id":"'+itemId+'", "userId":"143"}}');
        console.log(responseJson.error);
        if (responseJson.error == 0) {
          let data = responseJson.data;
          //alert(JSON.stringify(data))
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const goToTel = (val) => {
    Linking.openURL(`tel:${val}`);
    fetch(Urls.getPhoneClick+'?data={"data":{"business_id":"'+itemId+'",  "userId":"'+userId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //alert(Urls.getPhoneClick+'?data={"data":{"business_id":"'+itemId+'", "userId":"143"}}');
        console.log(responseJson.error);
        if (responseJson.error == 0) {
          let data = responseJson.data;
          //alert(JSON.stringify(data))
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const goToLocation = (val) => {
    fetch(Urls.getLocationClick+'?data={"data":{"business_id":"'+itemId+'", "userId":"'+userId+'", "address":"'+val+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.error);
        if (responseJson.error == 0) {

          let lat = responseJson.data.location.lat;
          let long = responseJson.data.location.lng;
         // Linking.openURL('https://www.google.com/maps/search/?api=1&query=47.5951518%2C-122.3316393');

          Linking.openURL('https://www.google.com/maps/search/?api=1&query='+lat+","+long);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });

  }
  const goToEmail = (val) => {
    Linking.openURL(`mailto:${val}`)
    fetch(Urls.getEmailClick+'?data={"data":{"business_id":"'+itemId+'", "userId":"'+userId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //alert(Urls.getEmailClick+'?data={"data":{"business_id":"'+itemId+'", "userId":"143"}}');
        console.log(responseJson.error);
        if (responseJson.error == 0) {
          let data = responseJson.data;
          //alert(JSON.stringify(data))
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const hideActivePhotoModal = () => {
    setLoadingLargeImage(false);
    setShowPhotoModal(false);
  };

  const showLargeImage = imageId => {
    //setLoadingLargeImage(true);
    console.log("modalData-"+imageId);
    (imageId ? setLargeImageData(imageId): null);
    setShowPhotoModal(true);
  };

  return (
    <ScrollView>  
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.innercontainer}>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Ad Name</Text>
            <Text style={styles.TextInputtext}>{tableData.business_name}</Text>
          </View>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Website URL</Text>
            <TouchableOpacity onPress={() => goToWebsite(tableData.weburl)}>
            <Text style={styles.TextInputtext}>{tableData.weburl}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Location</Text>
            <TouchableOpacity onPress={() => goToLocation(tableData.address1)}>
            <Text style={styles.TextInputtext}>{tableData.address1}</Text>
            </TouchableOpacity>
            </View>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Email</Text>
            <TouchableOpacity onPress={() => goToEmail(tableData.email)}>
            <Text style={styles.TextInputtext}>{tableData.email}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Contact Information</Text>
            <TouchableOpacity onPress={() => goToTel(tableData.contactno)}>
            <Text style={styles.TextInputtext}>{tableData.contactno}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.input}>
            <Text style={styles.TextInput}>Other Information</Text>
            <Text style={styles.TextInputtext}>{tableData.otherinfo}</Text>
          </View>
          <View>
          <TouchableOpacity
            key={tableData.bannerimg}
            onPress={() => showLargeImage(tableData.bannerimg)}>
              <Image
              resizeMode='contain'
              source={{
                uri: tableData.bannerimg,
                }}
                style={styles.mainImg}
              />
          </TouchableOpacity>
          </View>
          <Modal
        animationType="slide"
        transparent={true}
        visible={showPhotoModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          hideActivePhotoModal();
        }}>
        <Loader loadingLargeImage={loadingLargeImage} />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {largeImageData ? (
              <Image
                style={styles.cardPhotoLarge}
                resizeMode={'contain'}
                source={{
                  uri: largeImageData,
                }}
              />
            ) : (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={CustomColors.green} />
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, styles.btnTopcross]}
              onPress={() => hideActivePhotoModal()}>
              <MaterialIcons name="close" size={30} color="white" />
              {/* this is view close button */}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
          </View>
          </View>
  
    </ScrollView>
  );
};
export default AdDetailsScreen;
const styles = StyleSheet.create({
  bnrimg: {
    color: "#9e9e9e",
    marginTop: 50,
    marginBottom: 0,
    fontSize: 18,
  },  
  bigbnrimg: {
    color: "#9e9e9e",
    marginTop: 40,
    marginBottom: 0,
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
  innercontainer: {
    flex: 1,
    width:'100%',
    alignItems: 'flex-start',
    marginLeft:40
  },
  input: {
    borderWidth: 1,
    borderColor: '#9e9e9e',
    backgroundColor: '#fff',
    width: '90%',
    marginTop: 30,
    height: 60,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  camragrp: {
    flexDirection:'row',
    width:'40%',
    height:40,
    marginTop:15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  btngrp: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  
    borderRadius: 12,
    marginTop: 30,
  },
  picBtn: {
    width: '50%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: CustomColors.blue,

  },
  vdoBtn: {
    width: '50%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: CustomColors.white,
  },
  textAreaContainer: {
    width: '90%',
    backgroundColor: '#ebebeb',
    marginTop: 30,
    borderRadius: 20,
    height: 250,
    padding: 10,
  },
  postBtn: {
    marginTop: 20,
    backgroundColor: '#00afee',
    color: '#fff',
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  plusIcon: {
    padding:0,
    paddingRight:10,
  },
  browseText: {
    color: CustomColors.white, 
    fontSize:20,
  },
  loginTextPic: {
    color: CustomColors.white, 
    fontSize:24,
  },
  loginTextVdo: {fontSize:18},
  loginTextAddPic: {fontSize:18, color: '#fff'},
  TextInput: {color: CustomColors.black, fontSize:20, fontWeight: 'bold'},
  TextInputtext: {color: CustomColors.black, fontSize:15, },
  capturebtn: {  
    flex:1,
    flexDirection:'row',
    backgroundColor: '#3c3c3c',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImg: { //flex: 1,
    width: '95%',
    //width: 'auto',
    padding: 10,
    margin:0,
    aspectRatio: 1/1.3,
    //borderRadius: 0,
    alignItems: 'center',
   justifyContent: 'center',
   //position: 'relative',
   //height:'100%',
    marginLeft:0,
    marginRight:0,
    marginTop: 30,
    marginBottom:30,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems:'center',
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: '#9e9e9e',
    //transform: [{scale: 25}],
  },
  inputImage: {
    //flex:1,
    // position: 'relative',
    borderWidth: 1,
    borderColor: '#9e9e9e',
    backgroundColor: '#fff',
    width: '90%',
    //width: 'auto',
    //height:450,
    marginTop: 30,
    marginBottom:30,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems:'center',
  },
  cardPhotoLarge: {
    width: '100%',
   height: '100%',
   // marginTop: -10,
    //marginLeft: -10,
    marginBottom: 50,
    borderRadius: 10,
   // aspectRatio: 0.5/1.2,
    padding:0,
    margin:0,
  },
  btnTopcross: {
    position: 'absolute',
    left: 290,
    top: 10,
    backgroundColor: 'red',
    borderRadius: 9,
  },
  modalView: {
    marginLeft:5,
    marginRight:5,
    position: 'relative',
    height: '100%',
    left: 0,
    zIndex:0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    overflowX: 'auto',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 30,
  },
});
