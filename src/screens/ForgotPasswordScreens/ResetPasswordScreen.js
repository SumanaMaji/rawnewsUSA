import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';

const ResetPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [retype, setRetypepassword] = useState('');

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
    setPassword('');
    setNewpassword('');
    setRetypepassword('');
  };
  const handleSubmitPress = () => {
    //handlesubmit start here
   
    if (password.length == 0) {
      alert('Please Enter Current Password');
      //firstName.current.focus();
    } else if (newpassword.length == 0) {
      alert('Please Enter New Password');
    } else if (retype.length == 0) {
      alert('Please Enter Re-Type Password');
    }
    else {
      
      //Show Loader
      setLoading(true);

      let dataToSend = {
        password: password,
        newPassword: newpassword,
        retypePassword: retype,
        userId: userId
      };

    console.log(Urls.changePassword+'?data={"data":'+JSON.stringify(dataToSend)+'}');
    fetch(Urls.changePassword+'?data={"data":'+JSON.stringify(dataToSend)+'}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          //console.log(userId);
          //console.log('Success:', JSON.stringify(responseJson));
          if (responseJson.error == 0) {
            setLoading(false);
            let alertMessage = 'Password changed successfully.';
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
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        <Loader loading={loading} />
          <View style={styles.subcontainer}>
          <TextInput
              value={password}
              style={styles.input}
              placeholder="Current Passsword"
              keyboardType="default"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="black"
              onChangeText={Password => setPassword(Password)}
            />
            <TextInput
              value={newpassword}
              style={styles.input}
              placeholder="New Passsword"
              keyboardType="default"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="black"
              onChangeText={NewPassword => setNewpassword(NewPassword)}
            />
            <TextInput
              value={retype}
              style={styles.input}
              placeholder="Re-Type Password"
              secureTextEntry={true}
              keyboardType="default"
              autoCapitalize="none"
              placeholderTextColor="black"
              onChangeText={ReType => setRetypepassword(ReType)}
            />
            <View style={styles.btngrp}>
              <TouchableOpacity style={styles.submitbtn}
               onPress={handleSubmitPress}>
                <Text style={styles.btnText}> Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // backgroundColor: '#46d4c4',
    height: '100%',
  },
  subcontainer: {
    marginTop: 18,
    alignContent: 'center',
  },
  input: {
    width: 350,
    height: 55,
    // backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btngrp: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelbtn: {
    height: 55,
    width: '40%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  submitbtn: {
    height: 55,
    width: '40%',
    backgroundColor: '#3492eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
