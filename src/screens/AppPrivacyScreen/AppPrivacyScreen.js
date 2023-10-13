import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AppPrivacyScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [tableData, setTableData] = useState([ ]);
  const [selectedCategory, setSelectedCategory] = useState([]);

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
  return (
      <View>
    <View style={styles.Container}>  
      <View style={styles.MainContainer}>  
        <View style={styles.HeaderTitle}>
            <Loader loading={loading} />  
            <Text style={styles.AppTitle}>App Privacy</Text>
            <TouchableOpacity onPress={() => {Linking.openURL('https://rawnewsusa.com/privacy-policy/')}} >
            <Text style={styles.SeeDetails}>See Details</Text>
            </TouchableOpacity>
        </View>
        
<View style={styles.DescriptionText}>
    <Text style={styles.AppInfo}>
        The Developer, RAW NEWS INC., indicated that the app's privacy practices may include handling of data described below. For more information, see the
        <TouchableOpacity onPress={() => {Linking.openURL('https://rawnewsusa.com/privacy-policy/')}} >
    <Text style={styles.TextStyle}>
           RAW News USA privacy policy.
     </Text>
  </TouchableOpacity> 
    
</Text>
        </View>
          
      </View>

    
    </View>

    <View  style={styles.Container}>
        <View style={styles.MainContainer}>
            <View style={styles.DtaBox}>
            <Text style={styles.DtaTrack}>Data Used To Track You</Text>
            <Text style={styles.DtaText}>The following data may be used to tarck you across apps and websites owned by other companies </Text>
            </View>
             
             <View style={styles.ListIcon}>
                 <Text style={styles.ContactInfo}><FontAwesome style={styles.iconclrUsr } name="info-circle" size={24} /> Contact Info</Text>
                 <Text style={styles.Location}><FontAwesome style={styles.iconclrUsr } name="location-arrow" size={24}  /> Location</Text>
                 
             </View>
             <View style={styles.ListIconIdentifire}>
             <Text style={styles.Identifire}><FontAwesome style={styles.iconclrUsr } name="camera-retro" size={24}  /> Media Library</Text>
             </View>
        </View>
        
    </View>
      </View>


    

  );
};

export default AppPrivacyScreen;

const styles = StyleSheet.create({
  
Container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',  
  },

  MainContainer: {
    marginTop:10,
    width: '95%',
    borderWidth: 1,
    borderColor: '#9e9e9e',   
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  HeaderTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 5,
  },
  
  DescriptionText: {
    
    justifyContent: 'space-around',
    
    padding: 5,
  },

  AppTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
  },
 
  SeeDetails: {
    fontSize: 18,
    color:  '#2768e7',
    lineHeight: 30,
 },
 TextStyle: {
   fontSize: 16,
   color: '#2768e7',
   height: 20,
   marginTop: 78,
   marginLeft: 6,
 },
 AppInfo: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
 },

 DtaBox: {
     justifyContent: 'center',
     alignItems: 'center',
     
 },
 DtaTrack: {
     color: '#000',
     fontSize: 24,
     marginTop: 45,
 },
 DtaText: {
    color: '#000',
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
    marginTop: 15,
 },

 ListIcon: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     marginTop: 40,
     marginBottom: 40,
},
 
ListIconIdentifire: {
    flexDirection: 'row',
     justifyContent: 'space-around',
     marginBottom: 40,
    
},

ContactInfo: {
    fontSize: 18,
    color: '#000',
    
   
},
Location: {
    fontSize: 18,
    color: '#000',
},

Identifire: {
    fontSize: 18,
    color: '#000',
},

Icon: {
    borderWidth: 1,
    borderColor: '#000'
},
iconclrUsr: {
    paddingRight:30
}
});
