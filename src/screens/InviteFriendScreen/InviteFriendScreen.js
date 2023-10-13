import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import Contacts from 'react-native-contacts';
import SendSMS from 'react-native-sms';

const InviteFriendScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [contacts,setContacts] = useState([]);
  const [userId, setUserId] = useState();
    useEffect(() => {
      readUserId('user_id');
      if (Platform.OS === "android") {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: "Contacts",
          message: "This app would like to view your contacts."
        }).then(() => {
          //this.loadContacts();
          //getAllContact();
        });
      } else {
        //this.loadContacts();
       // getAllContact();
      }
       //getAllContact();
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
      const getAllContact = () => {
        Contacts.getAll().then(contacts => {
            //console.log("contctssss"+contacts);
            if(contacts.length > 0)
            {
              const newData = [];
              contacts.map((obj, index) => {
                let phone = '';
                if(obj.phoneNumbers.length >0)
                {
                  
                  obj.phoneNumbers.map((objPhone, indexPhone) => {
                    phone =  objPhone.number;
                  });
                }
                newData.push({name: obj.givenName, phone: phone});
              });
              //console.log("ss"+JSON.stringify(newData));
              setContacts(newData);
            }
          })
          .catch(
            function(error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
  const sendSMS = (name,mobileNumber) => {
    /*SendSMS.send(
      {
        // Message body
        body: 'Please install and use RAW News USA',
        // Recipients Number
        recipients: [mobileNumber],
        // An array of types 
        // "completed" response when using android
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled, error) => {
        if (completed) {
          alert('SMS Sent Completed');
        } else if (cancelled) {
          alert('SMS Sent Cancelled');
        } else if (error) {
          alert('Some error occured');
        }
      },
    );*/
  }
  return (
    <ScrollView>  
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        {(contacts.length > 0)  ? (
          contacts.map((rowData, index) => (
            <View style={styles.input} key={index}>
              <View style={styles.leftCard}>
                <Text>Name {rowData.name}</Text>
                <Text>Phone {rowData.phone}</Text>
              </View>
              <View style={styles.rightCard}>
                  <TouchableOpacity onPress={() => sendSMS(rowData.name,rowData.phone)}>
                    <Text style={styles.postBtn}>Invite</Text>
                  </TouchableOpacity>
              </View>
                
            </View>
          ))
          ): null}
        </View>
    </View>
    </ScrollView>
  );
};

export default InviteFriendScreen;

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
    justifyContent: 'flex-start',
    borderRadius: 5,
    flex:1,
    flexDirection:'row'
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
    backgroundColor: '#00afee',
    color: '#fff',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    fontSize:18,
    paddingTop:10,
    fontWeight:'bold'
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
  leftCard: {
    width:'70%'
  },
  rightCard: {
    justifyContent:'center',
    width:50,
    marginRight:0
  }
  
});
