import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  
  PermissionsAndroid,
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { ScrollView } from 'react-native-gesture-handler';

//import {requestUserPermission, notificationListener} from "../../utils/notificationService";

const NewsAddScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [newsTitle,setNewsTitle] = useState('');
  const [newsContent,setNewsContent] = useState('');
  const [newsType,setNewsType] = useState('I');
  const [newsFile,setNewsFile] = useState('');
  const [userId, setUserId] = useState();
  const [pushData, setPushData] = useState();
  const [newsData, setNewsData] = useState();
  const [compressloading,setCompressLoading] = useState(false);
  
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
    setNewsTitle('');
    setNewsContent('');
    setNewsType('');
    setNewsFile('');
  }
  const selectNewsFile = async () => {
    //alert(newsType)
    if(newsType=='I')
    {
      ImagePicker.openPicker({
        mediaType: 'image',
        includeBase64: true,
        compressImageQuality: 0.5,
      }).then(image => {
        if(newsType=='I')
        {
          let newsFile1 = "data:"+image.mime+";base64,"+image.data;
          setNewsFile(newsFile1);
        }
        else if(newsType=='V'){
          let newsFile1 = "data:video/mp4;base64,"+image.data;
          setNewsFile(newsFile1);
        }
        
      });
    }
    else if(newsType=='V'){
     
      ImagePicker.openPicker({
        mediaType: 'video',
        includeBase64: true,
        compressVideoPreset: 'MediumQuality'
      }).then(image => {
        console.log(JSON.stringify(image));
        RNFS.readFile(image.path, 'base64').then(res => {
          let newsFile1 = "data:video/mp4;base64,"+res;
          setNewsFile(newsFile1);      
      })
      .catch(err => {
          console.log(err.message, err.code);
      });
    
      });
    }
    
  };
  const handleSubmitPress = () => {
    if (newsTitle.length == 0) 
    {
        alert('Enter News Title');
        return false;
    }
    //Show Loader
    setLoading(true);

    let dataToSend = {
      title: newsTitle,
      content: newsContent,
      //mediatype: newsType,
      userId: userId,
    };
    if(newsFile)
    {
      if(newsType=='I')
      {
        let newData = {
          news_image: newsFile,
          mediatype: newsType
        }
        dataToSend = {...dataToSend, ...newData};
      }
      else if(newsType=='V'){
        let newData = {
          bluebook_video: newsFile,
          mediatype: newsType
        }
        dataToSend = {...dataToSend, ...newData};
      }
    }
    console.log(dataToSend)
    fetch(Urls.postNews, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.error == 0) {
          setLoading(false);
          let alertMessage = 'News added successfully.';
          alert(alertMessage);
          resetHandler();
          //notificationListener(navigation);
          console.log("data dup"+ JSON.stringify(responseJson.data));
          setNewsData(responseJson.data);
          setPushData(responseJson.notification);
          //requestUserPermission(userId);
         //console.log("push===>"+ JSON.stringify(pushData));

        //  (responseJson.notification.length) > 0 ?
        //  responseJson.notification.forEach((pushNotify) => {
        //     console.log("correct data"+ JSON.stringify(pushNotify));
        //     console.log("correct title"+JSON.stringify(newsData)+ "-----11"+JSON.stringify(responseJson.data));
        //     let dataToSend={
        //      to: pushNotify.fcmToken,
        //      android: {
        //       priority: "high" // HTTP v1 protocol
        //       },
        //      content_available: true,
        //       priority: 10,
        //        notification: {
        //          body: responseJson.data.title,//newsData.title,//newsData.content,//"Check Details Post here",
        //          title: "New Post Added in Your Locality",//newsData.title,
        //          subtitle: responseJson.data.content,//newsData.content,//"Post Details",
        //          content_available: true
        //        },
        //        data : {
        //         body: responseJson.data.title,//newsData.title,//newsData.content,//"Check Details Post here",
        //         title: "New Post Added in Your Locality",//newsData.title,
        //          newsID: responseJson.data.id,
        //          priority: 'high',
        //        },   
        //     };
        //       console.log(dataToSend);
        //       fetch('https://fcm.googleapis.com/fcm/send', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `key= ${pushNotify.serverKey}`,
        //       },
        //       body: JSON.stringify(dataToSend),
        //     })
        //       .then(response => response.json())
        //       .then(responseJson => {
        //         console.log('Success1:', JSON.stringify(responseJson));
        //         notificationListener(navigation);
        //       })
        //       .catch(error => {
        //         console.error('Error:', error);
        //       });
             
        //     }) : alert("No data for notifications");
        } else {
          setLoading(false);
          alert(responseJson.errorFriendlyMessage);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  return (
    <ScrollView>
    <View style={styles.container}>
    <Loader loading={loading} />
      <View style={styles.innercontainer}>
          <View style={styles.input}>
            <TextInput
              style={styles.TextInput}
              placeholder="Title"
              placeholderTextColor="#9e9e9e"
              value={newsTitle}
              onChangeText={NewsTitle => setNewsTitle(NewsTitle)}
              
            />
          </View>
          <Loader loading={compressloading} />
          <View style={styles.btngrp}>
          <TouchableOpacity
            onPress={() => setNewsType('I')}
            style={styles.picBtn}>
            <Text style={styles.loginTextAddPic}>Add Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.vdoBtn}
            onPress={() => setNewsType('V')}>
            <Text style={styles.loginTextVdo}>Add Video</Text>
          </TouchableOpacity>
        </View>
        
    <View style={styles.textAreaContainer} >
    <TextInput
      style={styles.TextInputAreaConatiner}
      placeholder="Enter message here"
      placeholderTextColor="#9a9a9a"
      fontSize={20}
      numberOfLines={10}
      multiline={true}
      value={newsContent}
      onChangeText={NewsContent => setNewsContent(NewsContent)}
    />
  </View>
  <View style={styles.camragrp}>
  <TouchableOpacity
    onPress={() => selectNewsFile()}
    style={styles.capturebtn}>
    <FontAwesome
      name="folder"
      size={24}
      color="white"
      style={styles.plusIcon}
    /><Text style={styles.browseText}>Browse...</Text>
  </TouchableOpacity>
  </View>
  <View style={styles.btngrp}>
          <TouchableOpacity
          onPress={() => handleSubmitPress()}
            style={styles.postBtn}>
            <Text style={styles.loginTextPic}>Post</Text>
          </TouchableOpacity>
        </View>
        
        </View>
    </View>
    </ScrollView>
  );
};

export default NewsAddScreen;

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
  input: {
    borderWidth: 1,
    borderColor: '#00afee',
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
    marginBottom: 40,
    backgroundColor: '#00afee',
    color: '#fff',
    width: 150,
    height: 40,
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
  TextInputAreaConatiner: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
