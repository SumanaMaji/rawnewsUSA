import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import CheckBoxKus from '../../Components/CheckBox/Checkbox'

const GettingPaidUserScreen = ({navigation}) => {
 
  const [firstName,setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
 // const [ssn, setSSN] = useState('');       
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [termsAccepted, settermsAccepted] = useState(true);
  const [userId, setUserId] = useState();

  useEffect(() => {
    readUserId('user_id');
  }, [userId]);

  const readUserId = async user_id => {
    try {
      const userId1 = await AsyncStorage.getItem(user_id);
      if (userId1 !== null) {
        setUserId(userId1);
       }
       else{
        navigation.navigate('LoginScreen');
       }
     } catch (e) {
       alert('Failed to fetch the data from storage');
     }
  };
const resetHandler = () => {
  setFirstName('');
  setLastName('');
  setEmail('');
  setCity('');
  setState('');
  setMailingAddress('');
  setPhone('');
  setZip('');
  //setSSN('');
  setLoading(false);
  setErrortext('');
};

  const handleSubmitPress = () => {
    //handlesubmit start here
    setErrortext('');
    if (firstName.length == 0) {
      alert('Please Enter First Name');
      //firstName.current.focus();
    } else if (lastName.length == 0) {
      alert('Please Enter Last Name');
    } else if (email.length == 0) {
      alert('Please Enter Email');
    } else if (mailingAddress.length == 0) {
      alert('Please Enter Email Address');
    } else if (city.length == 0) {
      alert('Please Enter City');
    } else if (state.length == 0) {
      alert('Please Enter State');
    } else if (zip.length == 0) {
      alert('Please Enter Zip-Code');
    }else if (phone.length == 0) {
      alert('Please Enter Phone Number');
    } 
    // else if (ssn.length == 0) {
    //   alert('Please Enter Social Security Number');
    // } 
    else {
      
      //Show Loader
      setLoading(true);

      let dataToSend = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        maling_address: mailingAddress,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        //FEIN: ssn,
      };

    console.log(Urls.getGettingPaidUser+'?data={"data":'+JSON.stringify(dataToSend)+'}');
    fetch(Urls.getGettingPaidUser+'?data={"data":'+JSON.stringify(dataToSend)+'}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('Success:', JSON.stringify(responseJson));
          if (responseJson.error == 0) {
            setLoading(false);
            let alertMessage = 'User added successfully.';
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
  
const handleCheckBox = () => {
  settermsAccepted(true);
}
  return (
    <ScrollView>  
    <View style={styles.container}>
    <Loader loading={loading} />
      <View style={styles.innercontainer}>
          <View>
            <Text style={styles.textBold}>
            EARN MONEY $$$ SHARING SHARING EXCLUSIVE NEWS CONTENT
            </Text>
            <Text style={styles.textBold}>
            POST YOUR VIDEOS OR ARTICLES
            </Text>
            <Text style={styles.textNormal}>
            Upload Newsworthy content such as:{"\n"}
            *On The Street Interviews{"\n"}
            *Videos of News Events That Just Happened{"\n"}
            *Stories The Mainstream News Has Ignored{"\n"}
            *Accidents, etc.
            </Text>
            <Text style={styles.textBold}>Rules and Restrictions</Text>
            <Text style={styles.textNormal}>We will only approve newsworthy content.  Reposting of other videos will not qualify for monetization.  Only original stories and videos will be compensated. We may accept posted content that may not qualify for monetization.</Text>
            <Text style={styles.textNormal}>All content must pass a review and approval process by our staff.  Monetization will be per unique view with in our mobile app.</Text>
          </View>
          <View style={styles.input}>
            <TextInput
              value={firstName}
              style={styles.TextInput}
              placeholder="First Name"
              placeholderTextColor="#9e9e9e"
              onChangeText={FirstName => setFirstName(FirstName)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={lastName}
              style={styles.TextInput}
              placeholder="Last Name"
              placeholderTextColor="#9e9e9e"
              onChangeText={LastName => setLastName(LastName)}
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
              value={mailingAddress}
              style={styles.TextInput}
              placeholder="Mailing Address"
              placeholderTextColor="#9e9e9e"
              onChangeText={MailingAddress => setMailingAddress(MailingAddress)}
            />
          </View>

          <View style={styles.input}>
          <TextInput
              value={state}
              style={styles.TextInput}
              placeholder="Enter State"
              placeholderTextColor="#9e9e9e"
              onChangeText={State => setState(State)}
            />
            </View>
            <View style={styles.input}>
            <TextInput
              value={city}
              style={styles.TextInput}
              placeholder="Enter City"
              placeholderTextColor="#9e9e9e"
              onChangeText={City => setCity(City)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={phone}
              style={styles.TextInput}
              placeholder="Phone"
              placeholderTextColor="#9e9e9e"
              onChangeText={Phone => setPhone(Phone)}
            />
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
          {/* <View style={styles.input}>
            <TextInput
              value={ssn}
              style={styles.TextInput}
              placeholder="Social Security Number"
              placeholderTextColor="#9e9e9e"
              onChangeText={SSN => setSSN(SSN)}
            />
          </View> */}
          <View style={styles.MainermsConditions}>
          <CheckBoxKus 
              selected={termsAccepted} 
              onPress={handleCheckBox}
              text='Yes, I understand and agree to RAW News'
          />               
            </View>
  <View style={styles.btngrp}>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={handleSubmitPress}>
            <Text style={styles.loginTextPic}>Submit</Text>
          </TouchableOpacity>
    </View>


        
        </View>
    </View>
    </ScrollView>
  );
};

export default GettingPaidUserScreen;

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
    marginTop:15,
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
  TextInput: {color: CustomColors.black, fontSize:18},

  capturebtn: {
    
    
    flex:1,
    flexDirection:'row',
    backgroundColor: '#3c3c3c',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input1: {
    // width: 350,
    width: 335,
    height: 55,
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
  },
  textBold: {
    paddingTop:30,
    fontWeight:'bold'
  },
  textNormal: {fontSize:16, paddingRight:15}
});
