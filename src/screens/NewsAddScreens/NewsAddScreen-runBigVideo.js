import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import Moment from 'moment';
import Loader from '../../Components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {ScrollView} from 'react-native-gesture-handler';
import YTDAPI from '../../Components/API';
import axios from 'axios';

//import {requestUserPermission, notificationListener} from "../../utils/notificationService";

const NewsAddScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [accessToken, setAccessToken] = useState();
  const [newsType, setNewsType] = useState('I');
  const [newsFile, setNewsFile] = useState('');
  const [userId, setUserId] = useState();
  const [pushData, setPushData] = useState();
  const [newsData, setNewsData] = useState();
  const [videoPath, setVideoPath] = useState('');
  const [newsVideoFileUpload, setNewsVideoFileUpload] = useState(false);

  useEffect(() => {
    readUserId('user_id');
    var n = new Date();
console.log(n.toLocaleDateString("es-CL")+'-'+n.toLocaleTimeString("en-GB"));
    console.log(new Date().toLocaleDateString())
    console.log("currentdate--"+new Date().toLocaleTimeString([],{year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}));
  }, [userId]);

  const readUserId = async user_id => {
    try {
      const userId1 = await AsyncStorage.getItem(user_id);
      if (userId1 !== null) {
        setUserId(userId1);
      } else {
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
    //setNewsVideoFile('');
  };
  const selectNewsFile = async() => {
    //alert(newsType)
    if (newsType == 'I') {
      ImagePicker.openPicker({
        mediaType: 'image',
        includeBase64: true,
        compressImageQuality: 0.5,
      }).then(image => {
        if (newsType == 'I') {
          let newsFile1 = 'data:' + image.mime + ';base64,' + image.data;
          setNewsFile(newsFile1);
        }
        // else if(newsType=='V'){
        //   let newsFile1 = "data:video/mp4;base64,"+image.data;
        //   setNewsFile(newsFile1);
        // }
      });
    } else if (newsType == 'V') {
      ImagePicker.openPicker({
        mediaType: 'video',
        includeBase64: true,
        compressVideoPreset: 'MediumQuality',
      }).then(async image => {
        setVideoPath(image.path)
        console.log('videoPath--' + videoPath);
      });
     
    }
  };
  const handleSubmitPress = async () => {
    if (newsTitle.length == 0) {
      alert('Enter News Title');
      return false;
    }
    //Show Loader
    //setLoading(true);

    let dataToSend = {
      title: newsTitle,
      content: newsContent,
      //mediatype: newsType,
      userId: userId,
    };
    
      if (newsType == 'I') {
        let newData = {
          news_image: newsFile,
          mediatype: newsType,
        };
        dataToSend = {...dataToSend, ...newData};
        console.log(dataToSend);
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
              console.log('data dup' + JSON.stringify(responseJson.data));
              setNewsData(responseJson.data);
              setPushData(responseJson.notification);
            } else {
              setLoading(false);
              alert(responseJson.errorFriendlyMessage);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else if (newsType == 'V') {
        console.log("videoPath----"+videoPath)
        setLoading(true);
        const chunkSize = 1024 * 1024 * 10; // 1MB chunks
        //Replace with your upload endpoint
        uploadFileInChunks(videoPath, chunkSize);
      
      //  if(newsVideoFileUpload == false && newsVideoFileName != '')
      //  {
      //   var finalData = {
      //     bluebook_video: newsVideoFileName,
      //     mediatype: newsType,
      //   }
      //   dataToSend = {...dataToSend, ...finalData};
      //     console.log(dataToSend);
      //   fetch(Urls.postNews, {
      //     method: 'POST',
      //     body: JSON.stringify(dataToSend),
      //     headers: new Headers({
      //       'Content-Type': 'application/json',
      //     }),
      //   })
      //     .then(response => response.json())
      //     .then(responseJson => {
      //       console.log(responseJson);
      //       if (responseJson.error == 0) {
      //        // setYoutubeVideoData({});
      //         // setVideoId('');
      //         // setUploadedStatus('');
      //         // setVideoimageUrl('');
      //         setLoading(false);
      //         let alertMessage = 'News added successfully.';
      //         alert(alertMessage);
      //         resetHandler();
      //         //notificationListener(navigation);
      //         console.log("data dup"+ JSON.stringify(responseJson.data));
      //         setNewsData(responseJson.data);
      //         setPushData(responseJson.notification);
      //         //requestUserPermission(userId);
      //        //console.log("push===>"+ JSON.stringify(pushData));

      //       //  (responseJson.notification.length) > 0 ?
      //       //  responseJson.notification.forEach((pushNotify) => {
      //       //     console.log("correct data"+ JSON.stringify(pushNotify));
      //       //     console.log("correct title"+JSON.stringify(newsData)+ "-----11"+JSON.stringify(responseJson.data));
      //       //     let dataToSend={
      //       //      to: pushNotify.fcmToken,
      //       //      android: {
      //       //       priority: "high" // HTTP v1 protocol
      //       //       },
      //       //      content_available: true,
      //       //       priority: 10,
      //       //        notification: {
      //       //          body: responseJson.data.title,//newsData.title,//newsData.content,//"Check Details Post here",
      //       //          title: "New Post Added in Your Locality",//newsData.title,
      //       //          subtitle: responseJson.data.content,//newsData.content,//"Post Details",
      //       //          content_available: true
      //       //        },
      //       //        data : {
      //       //         body: responseJson.data.title,//newsData.title,//newsData.content,//"Check Details Post here",
      //       //         title: "New Post Added in Your Locality",//newsData.title,
      //       //          newsID: responseJson.data.id,
      //       //          priority: 'high',
      //       //        },
      //       //     };
      //       //       console.log(dataToSend);
      //       //       fetch('https://fcm.googleapis.com/fcm/send', {
      //       //       method: 'POST',
      //       //       headers: {
      //       //         'Content-Type': 'application/json',
      //       //         Authorization: `key= ${pushNotify.serverKey}`,
      //       //       },
      //       //       body: JSON.stringify(dataToSend),
      //       //     })
      //       //       .then(response => response.json())
      //       //       .then(responseJson => {
      //       //         console.log('Success1:', JSON.stringify(responseJson));
      //       //         notificationListener(navigation);
      //       //       })
      //       //       .catch(error => {
      //       //         console.error('Error:', error);
      //       //       });

      //       //     }) : alert("No data for notifications");
      //       } else {
      //         setLoading(false);
      //         alert(responseJson.errorFriendlyMessage);
      //       }
      //     })
      //     .catch(error => {
      //       console.error('Error:', error);
      //     });
      //  } 
        //const chunkSize = 1024 * 1024; // 1MB chunks

        // const stats =  RNFS.stat(videoPath);
        // const fileSize = stats.size;
        // console.log('fileSize'+JSON.stringify(fileSize))
        // let offset = 0;

        // while (offset < videoFileSize) {
        //   const chunk = RNFS.read(videoPath, chunkSize, offset, 'base64');
        //   const formData = new FormData();
        //   formData.append('chunk', chunk);
        //   formData.append('offset', offset.toString());
        //   formData.append('totalSize', videoFileSize.toString());

         
        //   offset += chunkSize;
              
        // }
       // setLoading(true);

        // var newData = {
        //   bluebook_video: formData,
        //   mediatype: newsType,
        // };
      //   var newData = {
      //     bluebook_video: newsFile,
      //     mediatype: newsType
      //   }
      // //  console.log(Urls.videoUpload+"-----"+JSON.stringify(newData))
      //   await fetch(Urls.videoUpload, {
      //     method: 'POST',
      //     body: JSON.stringify(newData),
      //     headers: new Headers({
      //       'Content-Type': 'application/json',
      //     }),
      //   })
      //   .then(response => response.json())
      //   .then(responseJsonData => {
      //     if (responseJsonData.error == 0) {
      //       console.log("responseJsonData--"+ JSON.stringify(responseJsonData))
      //       responseJsonData.data ? setNewsVideoFileName(responseJsonData.data.videoFilename) : null;
      //       console.log("videoFilename--"+newsVideoFileName)
      //       var finalData = {
      //         bluebook_video: newsVideoFileName,
      //         mediatype: newsType,
      //       }
      //       dataToSend = {...dataToSend, ...finalData};
      //       console.log("finaldata------"+JSON.stringify(dataToSend))
      //       fetch(Urls.postNews, {
      //         method: 'POST',
      //         body: JSON.stringify(dataToSend),
      //         headers: new Headers({
      //           'Content-Type': 'application/json',
      //         }),
      //       })
      //         .then(response => response.json())
      //         .then(responseJson => {
      //           console.log(responseJson);
      //           if (responseJson.error == 0) {
      //             setLoading(false);
      //             let alertMessage = 'News added successfully.';
      //             alert(alertMessage);
      //             resetHandler();
      //             //notificationListener(navigation);
      //             console.log('data dup' + JSON.stringify(responseJson.data));
      //             setNewsData(responseJson.data);
      //             setPushData(responseJson.notification);
      //           } else {
      //             setLoading(false);
      //             alert(responseJson.errorFriendlyMessage);
      //           }
      //         })
      //         .catch(error => {
      //           console.error('Error:', error);
      //         })
      //     } else {
      //       setLoading(false);
      //       alert(responseJsonData.errorFriendlyMessage);
      //     }         
      // })
      // .then(response => response.json())
      //  .then(responseJsonData => {
      //     console.log(responseJsonData.data);
      // });
      //}
      // setLoading(false);
    }
    else{
        console.log("text---"+dataToSend);
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
  };
  const uploadFileInChunks = async (filePath, chunkSize) => {
    setLoading(true)
    try {
      const stats = await RNFS.stat(filePath);
      const fileSize = stats.size;

      let offset = 0;
      var datetimeFormat = new Date();
      var dformat = datetimeFormat.toLocaleDateString("es-CL")+'-'+datetimeFormat.toLocaleTimeString("en-GB");
      var videofilename = (Math.random() + 1).toString(36).substring(7)+'_'+dformat+'.mp4';
      console.log("random", videofilename);

      while (offset < fileSize) {
        setNewsVideoFileUpload(true)
        const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('offset', offset.toString());
        formData.append('totalSize', fileSize.toString())
        formData.append('videoname', videofilename);
        console.log(formData);

        await fetch(Urls.videoUpload, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        })
        .then(response => response.json())
        .then(responseJsonData => {
        setLoading(false);
        console.log(responseJsonData.data.videoFilename);
        
      });
        // await axios.post(Urls.videoUpload, formData, {
        //   headers: {'Content-Type': 'multipart/form-data'},
        // });
        offset += chunkSize;
      }
      setNewsVideoFileUpload(false)
      console.log('Upload complete');

      let dataToSend = {
        title: newsTitle,
        content: newsContent,
        //mediatype: newsType,
        userId: userId,
      };
      var finalData = {
        bluebook_video: videofilename,
        mediatype: 'V',
      }
      dataToSend = {...dataToSend, ...finalData};
        console.log(dataToSend);
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

    } catch (error) {
      console.error('Error during chunk upload:', error);
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Loader loading={loading} />
        <Loader loading={newsVideoFileUpload} />
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

          <View style={styles.textAreaContainer}>
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
              />
              <Text style={styles.browseText}>Browse...</Text>
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
    width: '100%',
    alignItems: 'flex-start',
    marginLeft: 40,
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
    flexDirection: 'row',
    width: '40%',
    height: 40,
    marginTop: 15,
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
    padding: 0,
    paddingRight: 10,
  },
  browseText: {
    color: CustomColors.white,
    fontSize: 20,
  },
  loginTextPic: {
    color: CustomColors.white,
    fontSize: 24,
  },
  loginTextVdo: {fontSize: 18},
  loginTextAddPic: {fontSize: 18, color: '#fff'},
  TextInput: {color: CustomColors.black, fontSize: 18},

  capturebtn: {
    flex: 1,
    flexDirection: 'row',
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
