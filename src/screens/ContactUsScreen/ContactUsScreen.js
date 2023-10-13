import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ContactUsScreen = ({route,navigation}) => {
  
  const [autherName,setAutherName] = useState('');
  const [loading,setLoading] = useState(false);
  const [subject,setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState();
  const [contactData, setContactData] = useState();

  const [errortext, setErrortext] = useState('');

  useEffect(() => {
    readUserId('user_id');
    readAuther();
    getData();
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
  const readAuther = () => {
    if(route.params)
    {
      setAutherName(route.params.autherName)
    }
  }
    
const resetHandler = () => {
  setSubject('');
  setMessage('');
  setLoading(false);
  setErrortext('');
};

  const handleSubmitPress = () => {
    //handlesubmit start here
    setErrortext('');
    if (subject.length == 0) {
      alert('Please Enter Subject');
      //subject.current.focus();
    } else if (message.length == 0) {
      alert('Please Enter Message');
    } 
 else {
      
      //Show Loader
      setLoading(true);
      
      let dataToSend = {
        subject: subject,
        message: message,
        userId : userId,
      };
    fetch(Urls.addComplain, {
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
            let alertMessage = 'Thank you for contacting us. You will be shortly in contact.';
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
  const getData =  () => {
    setLoading(true);
   
    fetch(Urls.contactUs, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
       
        if (responseJson.error == 0) {
          let data = responseJson.data.data;
          console.log("contactus"+ JSON.stringify(data));
          setLoading(false);
          setContactData(data);
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
  const goToTel = (val) => {
    Linking.openURL(`tel:${val}`)
  }
  const sentEmail = (val) => {
    Linking.openURL(`mailto:${val}`)
  }
  return (
    <ScrollView>  
    <View style={styles.container}>
    <Loader loading={loading} />
      <View style={styles.innercontainer}>
      <View style={styles.addressContainer}>
      <Text style={styles.textTitle}>{ (autherName) ? (autherName )  : null} {"\n"} { contactData ? contactData.contact_name : 'Raw News USA LLC'} {"\n"} { contactData? contactData.contact_address : '4623 75th Street Suite 4-174'} {"\n"} { contactData ? contactData.contact_address2 : 'Kenosha, WI 53142'} </Text>
        </View>
          <View style={styles.TitleContainer}>
            <TouchableOpacity onPress={() => goToTel('+1 414-374-6999')}>
              <Text style={styles.textTitle}>Telephone: 414-374-6999</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.TitleContainer}>
            <TouchableOpacity onPress={() => sentEmail('support@rawnewsusa.com')}>
              <Text style={styles.textTitle}>Email: {contactData ? contactData.admin_email : 'support@rawnewsusa.com'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.TitleContainer}>
              <Text style={styles.textTitle}>Send us a message</Text>
          </View>
          <View style={styles.input}>
            <TextInput
              value={subject}
              style={styles.TextInput}
              placeholder="Subject"
              placeholderTextColor="#9e9e9e"
              keyboardType="default"
              onChangeText={Subject => setSubject(Subject)}
            />
          </View>
          <View style={styles.InputBig}>
            <TextInput
              value={message}
              style={styles.TextInput}
              placeholder="Message"
              placeholderTextColor="#9e9e9e"
              multiline={true}
              keyboardType="default"
              onChangeText={Message => setMessage(Message)}
            />
          </View>

  
  <View style={styles.btngrp}>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={handleSubmitPress}>
            <Text style={styles.loginTextPic}>Send</Text>
          </TouchableOpacity>
        </View>
        
        </View>
    </View>
    </ScrollView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  
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
  addressContainer: {
    width: '90%',
    marginTop: 30,
    height: 100,
    padding: 10,
    justifyContent: 'center',
    alignContent:'center',
  },
  TitleContainer: {
    width: '90%',
    marginTop: 10,
    height: 45,
    padding: 8,
    justifyContent: 'center',
    alignContent:'center',
  },
  textTitle: {
    fontSize:17,
    fontWeight:'bold'
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
  TextInput: {color: CustomColors.black, fontSize:18, },
  InputBig: {
    borderWidth: 1,
    borderColor: '#9e9e9e',
    backgroundColor: '#fff',
    width: '90%',
    marginTop: 30,
    height: 200,
    padding: 10,
    justifyContent: 'flex-start',
    borderRadius: 5,
  },
  btngrp: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  
    borderRadius: 12,
    marginTop: 30,
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
  loginTextPic: {
    color: CustomColors.white, 
    fontSize:24,
  },
  
});
