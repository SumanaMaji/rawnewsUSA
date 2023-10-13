import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';

const AuthorDetailsScreen = ({route,navigation}) => {
  navigation.setOptions({
    headerTitle: 'Author Details',
  });
  const [autherName,setAutherName] = useState('');
  const [loading,setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [tableData, setTableData] = useState([ ]);

  useEffect(() => {
    readUserId('user_id');
    readAuther();
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
    setLoading(true);
    console.log("testuser"+route.params.autherName);
    fetch(Urls.authorDetails+'?data={"data":{"first_name":"'+route.params.autherName+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
   .then(response => response.json())
   .then(responseJson => {
     if (responseJson.error == 0) {
       let data = responseJson.data.user;
       setTableData(data);

       console.log(data.phone);
       console.log(data.email);
       setLoading(false);
     } else {
      alert(responseJson.errorFriendlyMessage);
      setLoading(false);
       console.log('user data not available');
     }
   })
   .catch(error => {
     console.error(error);
   });
      }
  }

  const goToTel = (val) => {
    Linking.openURL(`tel:+1 ${val}`)
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
              <Text style={styles.textTitle}>{ (autherName) ? (autherName )  : null} {"\n"}Raw News USA {"\n"}7901 W. Burleigh St{"\n"}Milwaukee, WI 53216</Text>
          </View>
          { (tableData.phone) ? (
          <View style={styles.TitleContainer}>
            <TouchableOpacity onPress={() => goToTel(tableData.phone)}>
              <Text style={styles.textTitle}>Telephone: +1 {tableData.phone}</Text>
            </TouchableOpacity>
          </View> ) : null }
          { (tableData.phone) ? (
          <View style={styles.TitleContainer}>
            <TouchableOpacity onPress={() => sentEmail(tableData.email)}>
              <Text style={styles.textTitle}>Email: {tableData.email}</Text>
            </TouchableOpacity>
          </View> ) : null }
        
        </View>
    </View>
    </ScrollView>
  );
};

export default AuthorDetailsScreen;

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
});
