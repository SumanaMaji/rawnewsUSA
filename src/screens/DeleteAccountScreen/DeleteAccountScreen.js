import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
  ToastAndroid
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';

const DeleteAccountScreen = ({navigation, props}) => {
  
  const [loading,setLoading] = useState(false);
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
  const deleteData =  () => {
    setLoading(true);
   
      fetch(Urls.deleteUser+'?data={"data":{"userId":"'+userId+'"}}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
    })
      .then(response => response.json())
      .then(responseJson => {
       
        if (responseJson.error == 0) {
          let data = responseJson.data.data;
          console.log("delete account"+ JSON.stringify(data));
          setLoading(false);
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
  const handleSignOut = () => {  
    Alert.alert(
      'Delete Account',
      'Are you sure want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.clear();
            deleteData();
           navigation.replace('DrawerNavigationRoutes');
            ToastAndroid.show(
              'Account Deletion successfully.',
              ToastAndroid.LONG,
            );
          },
        },
      ],
      {cancelable: false},
    );
};
  return (
    <ScrollView>  
    <View style={styles.container}>
    <Loader loading={loading} />
      <View style={styles.innercontainer}>
      <View style={styles.addressContainer}>
        <Text style={styles.textTitle}>This acction is irreversible, it will delete your personal account, posts and activity. </Text>
      </View>
      </View>
          <View style={styles.deleteBtn}>
              <Button
            title="Yes, Delete My Account"
            color="#FF0000"
            onPress={() => handleSignOut()}
              />
          </View>
    </View>    
    </ScrollView>
  );
};

export default DeleteAccountScreen;

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
  textTitle: {
    fontSize:18,
    fontWeight:'bold'
  },
  deleteBtn:{
    alignItems: 'flex-end',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  }
});
