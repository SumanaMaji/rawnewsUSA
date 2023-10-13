import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [tableData, setTableData] = useState([ ]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    readUserId('user_id');
    getData();
    getUserData();
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
  const handleCheckBox = (id) => {
    let array = [...selectedCategory]; 
    let index = array.indexOf(id)
    if (index !== -1) {
      array.splice(index, 1);
      setSelectedCategory(array);
    }
    else
    {
      array.push(id);
      setSelectedCategory(array);
    }
    renderChakbox(id);
    console.log(JSON.stringify(selectedCategory))
  }
  const getUserData = () => {
    //setLoading(true);
    console.log("testuser"+userId);
    fetch(Urls.userDetails+'?data={"data":{"id":"'+userId+'"}}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          let data = responseJson.data.user;
          console.log(data.categoryId);
          setSelectedCategory(data.categoryId);
          //setLoading(false);
        } else {
          console.log('user data not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const getData = () => {
    setLoading(true);
    fetch(Urls.getAllCategory, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error == 0) {
          let data = responseJson.data.category;
          setTableData(data);
          setLoading(false);
        } else {
          setLoading(false);
          console.log('setting data not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleSubmitPress = () => {
    setLoading(true);
    fetch(Urls.submitCategory+'?data={"data":{"userId":"'+userId+'", "categoryId": "'+(selectedCategory)+'" }}', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
//alert('Success:', JSON.stringify(responseJson));
        if (responseJson.error == 0) {
          setLoading(false);
          let alertMessage = 'Settings saved successfully.';
          alert(alertMessage); 
        } else {
          setLoading(false);
          alert(responseJson.errorFriendlyMessage);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  const renderChakbox = (item) =>
  {
   // console.log('d')
    let selectedCat = false;
    if(selectedCategory.indexOf(item.id) > -1){ selectedCat = true;}
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={[styles.checkBox]} onPress={() => handleCheckBox(item.id)}>
                <Icon 
                    size={30}
                    color='#211f30'
                    name={ selectedCat ? 'check-box' : 'check-box-outline-blank'}
                />
                <Text style={styles.textStyle} > {item.name} </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View>  
      <Loader loading={loading} />
      <FlatList
          showsVerticalScrollIndicator={false}
          data={tableData}
          numColumns={1}
          renderItem={({item, index}) => {
            return (
                renderChakbox(item)
              );
          }}
        />
      <View style={styles.btngrp}>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={handleSubmitPress}>
            <Text style={styles.loginTextPic}>Save</Text>
          </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft:20
    
  },
  textStyle:{
      color:CustomColors.black,
      fontSize:16,
      paddingTop:5
  },
  mainContainer: {
    flexDirection:'row',
    height:35,
    marginTop:10
},
checkBox: {
    alignItems: 'center',
    flexDirection:'row'
},
btngrp: {
  marginTop:15,
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