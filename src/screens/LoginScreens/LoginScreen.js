import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
import Loader from '../../Components/Loader/Loader';
import * as Urls from '../../constants/ConstantVariables/Urls';

const LoginScreen = ({navigation}) => {
  
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();
  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      setErrortext('Please enter email');
      return;
    }
    if (!userPassword) {
      setErrortext('Please enter password');
      return;
    }
    setLoading(true);
    fetch(Urls.login+'?data={"data":{"username":"'+userEmail+'","password":"'+userPassword+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        if (responseJson.error == 0) {
          let data = responseJson.data.user;
          console.log(data.id);
          AsyncStorage.setItem('user_name', data.first_name);
          AsyncStorage.setItem('user_id', JSON.stringify(data.id));
          navigation.replace('DrawerNavigationRoutes');
        } else {
          setErrortext('Please check your user name or password');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        setErrortext(
          'An error occured, Please check your internet and try again later.',
        );
        console.error(error);
      });
  };

  return (
    <View style={styles.mainContainer}> 
      <Loader loading={loading} />
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.image}
          />
          <View style={styles.inputView}>
         
            <TextInput
              style={styles.TextInput}
              onChangeText={UserEmail => setUserEmail(UserEmail)}
              placeholder="Email Id" //dummy@abc.com
              placeholderTextColor="#9c9c9c"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            
            
            <TextInput
              style={styles.TextInput}
              onChangeText={UserPassword => setUserPassword(UserPassword)}
              placeholder="Password"
              placeholderTextColor="#9c9c9c"
              keyboardType="default"
              ref={passwordInputRef}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />    
          </View>
        {errortext != '' ? (
          <Text style={styles.errorTextStyle}> {errortext} </Text>
        ) : null}
        <View style={styles.btngrp}>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.replace('SignupScreen')}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => handleSubmitPress()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
            onPress={() => navigation.replace('ForgotPasswordScreen')}>
            <Text style={styles.forgot_pass }> forgot password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({

  mainContainer: { 
    backgroundColor: CustomColors.black,
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  container: {
    marginTop:150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 400,
    backgroundColor: CustomColors.white,
    borderWidth: 1,
    borderColor: CustomColors.sky,
    borderRadius: 10,
    marginLeft: 10,
  },

  image: {
    marginTop: -30,
    marginBottom: 30,
    borderRadius: 10,
  },
  inputView: {
    backgroundColor: CustomColors.white,
    borderRadius: 10,
    width: '90%',
    height: 60,
    marginBottom: 25,
  },

  TextInput: {
    height: 40,
    fontSize: 20,  
    flex: 1,
    padding: 5,
    borderWidth: 2,
    borderColor: '#e7e7e7',
  },

  forgot_button: {
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'normal',
    height: 25,
    textDecorationLine: 'underline',
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: 'white',
  },
  btngrp: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    height: 60,
    marginBottom: 40,
  },
  forgot_pass: {
    color: '#00afee',
    marginTop: 10,
    marginBottom: 60,
    fontSize: 16,
  },
  registerBtn:{
    width: '50%',
    borderRadius: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: CustomColors.black,
    color: 'white',
  },
  loginBtn: {
    width: '50%',
    borderRadius: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: CustomColors.blue,
    color: 'white',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  
});
