import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import { Dropdown } from 'react-native-element-dropdown';

const PlaceYourAdScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [businessName,setBusinessName] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [state, setState] = useState([]);
  const [description, setDescription] = useState('');
  const [zip, setZip] = useState('');
  const [smallImageData, setSmallImageData] = useState('');
  const [bigImageData, setBigImageData] = useState('');
  const [userId, setUserId] = useState();

  const [errortext, setErrortext] = useState('');

  useEffect(() => {
    readUserId('user_id');
    getCountry();
  }, [country.length, userId]);

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

const resetHandler = () => {
  setBusinessName('');
  setWebUrl('');
  setEmail('');
  setAddress('');
  setOtherInfo('');
  setCountry([]);
  setCity([]);
  setState([]);
  setDescription('');
  setZip('');
  setSelectedCity('');
  setSelectedState('');
  setSelectedCountry('');
  setSmallImageData('');
  setBigImageData('');
  setLoading(false);
  setErrortext('');
};
  const getCountry =() => {
    fetch(Urls.getAllCountryList, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error == 0) {
        let data = responseJson.data.data;
        //console.log(data);
        const newData = [];
        const d = Array();
        {
          data.map((obj, index) => {
            let divNm = obj.name;
            if (obj.name && d[index - 1] != divNm) {
              newData.push({label: divNm, value: divNm});
              d.push(divNm);
            }
          });
        }
        setCountry(newData);
      } else {
        console.log('Please check your user name or password');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  const getAllStates =(country) => {
    setSelectedCountry(country);
    if(country=='United States')
    {
      fetch(Urls.getAllStateList, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          let data = responseJson.data.data;
          //console.log(data);
          const newData = [];
          const d = Array();
          {
            data.map((obj, index) => {
              let divNm = obj.name;
              if (obj.name && d[index - 1] != divNm) {
                newData.push({label: divNm, value: divNm});
                d.push(divNm);
              }
            });
          }
          setState(newData);
        } else {
          console.log('Please check your user name or password');
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
    else{
      setState([]);
    }
    
  };
  
  const getAllCity = (stateId) => {
    setSelectedState(stateId)
    fetch(Urls.getAllCityList + '?data={"data":{"state":"'+stateId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error == 0) {
        let data = responseJson.data.data;
        //console.log(data);
        const newData = [];
        const d = Array();
        {
          data.map((obj, index) => {
            let divNm = obj.name;
            if (obj.name && d[index - 1] != divNm) {
              newData.push({label: divNm, value: divNm});
              d.push(divNm);
            }
          });
        }
        setCity(newData);
      } else {
        console.log('Please check your user name or password');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleSubmitPress = () => {
    //handlesubmit start here
    setErrortext('');
    if (businessName.length == 0) {
      alert('Please Enter Business Name');
      //businessName.current.focus();
    } else if (webUrl.length == 0) {
      alert('Please Enter Web Url');
    } else if (email.length == 0) {
      alert('Please Enter Email');
    } else if (address.length == 0) {
      alert('Please Enter Address');
    } else if (otherInfo.length == 0) {
      alert('Please Enter Other Info');
    }else if (country.length == 0) {
      alert('Please Enter Country');
    }else if (city.length == 0) {
      alert('Please Enter City');
    } else if (state.length == 0) {
      alert('Please Enter State');
    } else if (zip.length == 0) {
      alert('Please Enter Zip-Code');
    }else if (description.length == 0) {
      alert('Please Enter Description');
    } 
 else {
      
      //Show Loader
      setLoading(true);
      let images = [];
      /*photo.forEach(fh => {
        images.push({
          base64: fh.base64,
          DateTime: fh.DateTime,
        });
      });*/
      
      let dataToSend = {
        business_name: businessName,
        weburl: webUrl,
        email: email,
        address1: address,
        otherinfo : otherInfo,
        country : selectedCountry,
        city: selectedCity,
        state: selectedState,
        zip: zip,
        description: description,
        userId : userId,
        small_banner_image: smallImageData,
        bannerimg: bigImageData
      };
    fetch(Urls.getPlaceAd, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          //console.log('Success:', JSON.stringify(responseJson));
          if (responseJson.error == 0) {
            setLoading(false);
            let alertMessage = 'Ad placed successfully.';
            alert(alertMessage);
            resetHandler();
          } else {
            setLoading(false);
            alert(responseJson.errorFriendlyMessage);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
  }
  const selectSmallBanner = async () => {
    ImagePicker.openPicker({
      mediaType: 'image',
      includeBase64: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        let smallImage = "data:"+image.mime+";base64,"+image.data;
        setSmallImageData(smallImage);
      })
      .catch(e => alert(e));
  };
  const selectBigBanner = async () => {
    ImagePicker.openPicker({
      mediaType: 'image',
      includeBase64: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        let smallImage = "data:"+image.mime+";base64,"+image.data;
        setBigImageData(smallImage);
      })
      .catch(e => alert(e));
  };

  return (
    <ScrollView>  
    <View style={styles.container}>
    <Loader loading={loading} />
      <View style={styles.innercontainer}>
          <View style={styles.input}>
            <TextInput
              value={businessName}
              style={styles.TextInput}
              placeholder="Business Name"
              placeholderTextColor="#9e9e9e"
              onChangeText={BusinessName => setBusinessName(BusinessName)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={webUrl}
              style={styles.TextInput}
              placeholder="Web url"
              placeholderTextColor="#9e9e9e"
              onChangeText={WebUrl => setWebUrl(WebUrl)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={email}
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#9e9e9e"
              onChangeText={Email => setEmail(Email)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={address}
              style={styles.TextInput}
              placeholder="Address"
              placeholderTextColor="#9e9e9e"
              onChangeText={Address => setAddress(Address)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
             value={otherInfo}
              style={styles.TextInput}
              placeholder="Other info"
              placeholderTextColor="#9e9e9e"
              onChangeText={OtherInfo => setOtherInfo(OtherInfo)}
            />
          </View>
          <View style={styles.input}>
          <Dropdown 
            data={country}
            search
            labelField="label"
            valueField="value"
            placeholder='Select Country'
            value={selectedCountry}
            searchPlaceholder="Search..."
            onChange={item => {
              getAllStates(item.value);
            }}
          />
          </View>
          <View style={styles.input}>
            {
              (state.length>0)? (
                <Dropdown 
                  data={state}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder='Select State'
                  value=""
                  searchPlaceholder="Search..."
                  onChange={item => {
                    getAllCity(item.value);
                  }}
                />
              ) : (
                <TextInput
                  value={selectedState}
                    style={styles.TextInput}
                    placeholder="Enter State"
                    placeholderTextColor="#9e9e9e"
                    onChangeText={SelectedState => setSelectedState(SelectedState)}
                  />
              )
            }
          
          </View>
          <View style={styles.input}>
              {
                (city.length>0) ? (
                  <Dropdown 
                  data={city}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder='Select City'
                  value=""
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setSelectedCity(item.value);
                  }}
                />
                ) :(
                  <TextInput
                  value={selectedCity}
                    style={styles.TextInput}
                    placeholder="Enter City"
                    placeholderTextColor="#9e9e9e"
                    onChangeText={SelectedCity => setSelectedCity(SelectedCity)}
                  />
                )
              }
          </View>
          <View style={styles.input}>
            <TextInput
              value={zip}
              style={styles.TextInput}
              placeholder="Zip code"
              placeholderTextColor="#9e9e9e"
              onChangeText={ZipCode => setZip(ZipCode)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={description}
              style={styles.TextInput}
              placeholder="Description"
              placeholderTextColor="#9e9e9e"
              onChangeText={Description => setDescription(Description)}
            />
          </View>

  <Text style={styles.bnrimg}>Small Banner Image</Text>
  <Text style={styles.bnrimginfo}>Banner Size should be 500pxX100px</Text>
  <View style={styles.camragrp}>
  
  <TouchableOpacity
    onPress={() => selectSmallBanner()}
    style={styles.capturebtn}>
    <FontAwesome
      name="folder"
      size={24}
      color="white"
      style={styles.plusIcon}
    /><Text style={styles.browseText}>Browse...</Text>
  </TouchableOpacity>
  </View>
  <Text style={styles.bigbnrimg}>Big Banner Image </Text>
  <Text style={styles.bnrimginfo}>Banner Size should be 600pxX800px</Text>
  <View style={styles.camragrp}>
  
  <TouchableOpacity
    onPress={() => selectBigBanner()}
    style={styles.capturebtn}>
    <FontAwesome
      name="folder"
      size={24}
      color="white"
      style={styles.plusIcon}
    /><Text style={styles.browseText}>Browse...</Text>
  </TouchableOpacity>
  </View>
  <View style={styles.btngrp}>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={handleSubmitPress}>
            <Text style={styles.loginTextPic}>Post</Text>
          </TouchableOpacity>
        </View>
        
        </View>
    </View>
    </ScrollView>
  );
};

export default PlaceYourAdScreen;

const styles = StyleSheet.create({
  bnrimg: {
    color: "#9e9e9e",
    marginTop: 50,
    marginBottom: 0,
    fontSize: 18,
  },  
  bnrimginfo: {
    marginTop: 10,
    color: 'red',
    fontSize: 16
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
    height: 65,
    padding: 8,
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
  TextInput: {color: CustomColors.black, fontSize:18, },

  capturebtn: {
    
    
    flex:1,
    flexDirection:'row',
    backgroundColor: '#3c3c3c',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
