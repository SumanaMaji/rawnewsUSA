import React, {useState, useEffect, createRef} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomColors} from '../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomSidebarMenu = (props) => {
  //console.log(props);
  
 const [userName, setUserName] = useState('');
  
 useEffect(() => {
    readData('user_name');
  }, []);
 
 
  const readData = async user_name => {
      try {
        const userId1 = await AsyncStorage.getItem(user_name);
        if (userId1 !== null) {
          setUserName(userId1);
         }
       } catch (e) {
         alert('Failed to fetch the data from storage');
       }
     }; 
  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
          {
            (userName!='')? (
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Text style={{fontSize: 25, color: '#307ecc'}}>
            {userName.charAt(0)}
          </Text>
        </View>
          ) : null
        }
        <Text style={stylesSidebar.profileHeaderText}>
          {userName} 
        </Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {
          (userName!='')? (
            
        <DrawerItem
          label={({color}) => 
          
            <View style={{flex:1,flexDirection:'row'}}>
                <FontAwesome
                  name="plus-square"
                  size={30}
                  color={ '#fff'}
                />
                <Text style={{marginLeft: 25,paddingTop:5,color: '#000000',}}>
                  Logout
                </Text>
            </View>
            
          }
          onPress={() => {
            props.navigation.toggleDrawer();
            Alert.alert(
              'Logout',
              'Are you sure? You want to logout?',
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
                    props.navigation.replace('LoginScreen');
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />

        ) : null
      }
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: CustomColors.blue,
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: CustomColors.blue,
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
});