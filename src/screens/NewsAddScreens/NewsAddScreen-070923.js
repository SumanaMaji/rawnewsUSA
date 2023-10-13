import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid
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
import YTDAPI from '../../Components/API'


//import {requestUserPermission, notificationListener} from "../../utils/notificationService";

const NewsAddScreen = ({navigation}) => {
 
  const [loading,setLoading] = useState(false);
  const [newsTitle,setNewsTitle] = useState('');
  const [newsContent,setNewsContent] = useState('');
  const [accessToken,setAccessToken] = useState();
  const [newsType,setNewsType] = useState('I');
  const [newsFile,setNewsFile] = useState('');
  const [userId, setUserId] = useState();
  const [pushData, setPushData] = useState();
  const [newsData, setNewsData] = useState();
  const [compressLoading,setCompressLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [videoimageUrl, setVideoimageUrl] = useState('');
  const [uploadedStatus, setUploadedStatus] = useState('');
  const [uploadedStatusNew, setUploadedStatusNew] = useState('');
  const [videoIdUpdate, setVideoIdUpdate] = useState('');
  const [videoimageUrlUpdate, setVideoimageUrlUpdate] = useState('');
  const timerRef = useRef(false);
  const testdata = {
    "kind": "youtube#video",
    "etag": "1S_JliVx5miCQ6usCgq_LsUJUys",
    "id": "SGhbd65lD28",
    "snippet": {
      "publishedAt": "2023-07-24T08:16:05Z",
      "channelId": "UCchBlYHJFxb73cnWBMJHJQg",
      "title": "Demo24thjulydata",
      "description": "This is a new description",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/SGhbd65lD28/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/SGhbd65lD28/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/SGhbd65lD28/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Blue Book Black News",
      "tags": [
        "youtube-cors-upload"
      ],
      "categoryId": "22",
      "liveBroadcastContent": "none",
      "localized": {
        "title": "Demo24thjulydata",
        "description": "This is a new description"
      }
    },
    "status": {
      "uploadStatus": "uploaded",
      "privacyStatus": "public",
      "license": "youtube",
      "embeddable": true,
      "publicStatsViewable": true
    }
  };
  useEffect(() => {
    readUserId('user_id');
    getAccessToken();
    console.log("accToken--"+accessToken);
    if(uploadedStatus){
      setUploadedStatusNew(uploadedStatus);
    }
    if(videoId){
      setVideoIdUpdate(videoId);
    }
    if(videoimageUrl){
      setVideoimageUrlUpdate(videoimageUrl);
    }
    console.log('viiiddd-----' + '[[[]]]]' + videoId +'----'+uploadedStatus +'====='+videoimageUrl)
  }, [userId, videoId, uploadedStatus, videoimageUrl]);
 
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
    //setNewsVideoFile('');
  }
  const getAccessToken = () => {

    fetch(Urls.settings, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.error == 0) {
          setLoading(false);
          console.log("settings token"+ JSON.stringify(responseJson.data.data.accessToken));
          setAccessToken(responseJson.data.data.accessToken)        
        
        } else {
          setLoading(false);
          console.log(responseJson.errorFriendlyMessage);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });    
  } 
  const selectNewsFile =  () => {
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
        // else if(newsType=='V'){
        //   let newsFile1 = "data:video/mp4;base64,"+image.data;
        //   setNewsFile(newsFile1);
        // }
        
      });
    }
    else if(newsType=='V')
    {    
      ImagePicker.openPicker({
        mediaType: 'video',
        includeBase64: true,
        compressVideoPreset: 'MediumQuality'
      }).then(image => {
        //console.log(JSON.stringify(image));


        const filePath = 'path_to_file'; // Replace with the actual path of the file
        const chunkSize = 1024 * 1024; // 1MB chunks
        const uploadUrl = 'https://example.com/upload';
        // Replace with your upload endpoint

        RNFS.stat(image.path).then(fileInfo => {
          //console.log(fileInfo);
          var file = {
            name: fileInfo.path.split('/').pop(),
            size: fileInfo.size,
            uri: fileInfo.path,
            type: 'video/mp4'
          } 
          //setNewsVideoFile(file)
          setNewsFile(file);  
        });
    
        // RNFS.readFile(image.path, 'base64').then(res => {
        //   let newsFile1 = "data:video/mp4;base64,"+res;
        //   setNewsFile(newsFile1);           
        // })
        // .catch(err => {
        //     console.log(err.message, err.code);
        // });
    
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
    //setLoading(true);

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
      else if(newsType == 'V')
      {
        //setLoading(true);
        setCompressLoading(true);
        timerRef.current = true;
        //var newData = [];
        //console.log("youtubeVideoData--"+uploadedStatus);

       // setLoading(true);

        var metadata = {
          snippet: {
            title: newsTitle != '' ? newsTitle : 'This is a new title',
            description: newsContent != '' ? newsContent: 'This is a new description',
            tags: ['youtube-cors-upload'],
            categoryId: 22
          },
          status: {
            //privacyStatus: 'public'
            privacyStatus: 'unlisted'
          }
        }; 

        var uploader =  new YTDAPI({
          baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
          file: newsFile,
          token: accessToken,
         // token: 'ya29.a0AbVbY6MQlNOLcD5vE7qNgL-dw77bwMYKogi_WQ3wltJ4QKHSQrkQvs6knYdDy6i1qQDr7-Tm0Lg0m6YTunUd-RrE--0L0VLyorsa4R_2q4tPf6JJVFpfVEdezRkR3VoUjyjhjBkoq2_D5cjiSi1G68rX4u1B1kGPaCgYKATQSARISFQFWKvPlf3O73ssOQJBAg6VQzrjvfg0167',
          metadata: metadata,
          params: {
            part: Object.keys(metadata).join(',')
          },
          onError: function(data) {
            console.log(data);
            var message = data;
            try {
            var errorResponse = JSON.parse(data);
            message = errorResponse.error.message;
            } finally {
            alert('Oops!Something wrong...Please try again later');
            }
          }.bind(this),
          onProgress: function(data) {
            //setLoading(true);
            var currentTime = Date.now();
            var bytesUploaded = data.loaded;
            var totalBytes = data.total;
            var bytesPerSecond = bytesUploaded / ((currentTime - window.uploadStartTime) / 1000);
            var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
            var percentageComplete = (bytesUploaded * 100) / totalBytes;
            console.log("Uploaded: " + bytesUploaded + " | Total: " + totalBytes + " | Percentage: " + percentageComplete + " | Esitmated seconds remaining: " + estimatedSecondsRemaining);        
          
           // we can access the outer scope on self here
       // self.updateProgress(percentageComplete);
          }.bind(this),
          onComplete: function(data) {

console.log(data)
         
             // onComplete code
  let responseData = JSON.parse(data);
  console.log("typeof--"+typeof(data));
  console.log("typeof--"+typeof(responseData));

  console.log("iddd---"+responseData.id);
  console.log("statusssss---"+responseData.status?.uploadStatus)

  console.log("urll---"+responseData.snippet?.thumbnails?.high?.url)

var uploadVideoId = responseData.id;
var uploadVideoStatus = responseData.status?.uploadStatus;
var thumbnails = responseData.snippet?.thumbnails?.high?.url;
setVideoId(uploadVideoId);
setUploadedStatus(uploadVideoStatus);
setVideoimageUrl(thumbnails);

// if(uploadVideoId){
//   console.log("iddd---"+uploadVideoId);
//   setVideoId(uploadVideoId);
// }
// if(uploadVideoStatus){
//   setUploadedStatus(uploadVideoStatus);
// }
// if(thumbnails){
//   setVideoimageUrl(thumbnails);
// }
  // (uploadVideoId) ? setVideoId(uploadVideoId) : setVideoId('no');
  //   (uploadVideoStatus) ? setUploadedStatus(uploadVideoStatus) : setUploadedStatus('none');
  // (thumbnails) ? setVideoimageUrl(thumbnails) : setVideoimageUrl('none');

  ToastAndroid.show(
    'Video Uploaded successfully.',
    ToastAndroid.LONG,
  );
  setCompressLoading(false);
  timerRef.current = false;

  //console.log('Upload finished---'+videoId+'----'+uploadedStatus+'-----'+'----'+videoimageUrl+'----'+videoId)   
  // if(uploadedStatus === 'uploaded')
  // {
  //   //console.log('uploadedStatus--'+uploadedStatus);
  //   var newData = {
  //     youtube_video_id: videoId,
  //     youtube_video_image: videoimageUrl,
  //     mediatype: newsType
  //   }
  // }
  if(uploadedStatusNew == 'uploaded')
  {
    //console.log('uploadedStatus--'+uploadedStatus);
    var newData = {
      youtube_video_id: videoIdUpdate,
      youtube_video_image: videoimageUrlUpdate,
      mediatype: newsType
    }
  }
  dataToSend = {...dataToSend, ...newData};
console.log("final data-->"+JSON.stringify(dataToSend))
console.log('Upload finished---'+'---->'+'<-----'+videoId+'----'+uploadedStatusNew+'-----'+'----'+thumbnails+'----'+videoId)   
console.log('timerRef.current---'+timerRef.current+'======='+ compressLoading)
//console.log('Upload finished---'+'---->'+uploadVideoId+'<-----'+videoId+'----'+uploadVideoStatus+'-----'+'----'+thumbnails+'----'+videoId)   
 }.bind(this)
        
        });
      
    
        window.uploadStartTime = Date.now();
        uploader.upload();
        console.log('timerRef.current12---'+timerRef.current+'======='+ compressLoading)
      //if(uploader.upload())
      //{
        console.log("aaalll222----"+'----'+videoId+'--'+uploadedStatus+'----'+videoimageUrl+'----'+newsType);

        // if(uploadedStatus == 'uploaded')
        // {
        //   //console.log('uploadedStatus--'+uploadedStatus);
        //   var newData = {
        //     youtube_video_id: youtubeVideoId,
        //     youtube_video_image: videoimageUrl,
        //     mediatype: newsType
        //   }
        // }
        // else
        // {
        //   var newData = {
        //     bluebook_video: newsFile,
        //     mediatype: newsType
        //   }
        // }

        // var newData = {
        //   youtube_video_id: videoId,
        //   youtube_video_image: videoimageUrl,
        //   mediatype: newsType
        // }
      //}
        //dataToSend = {...dataToSend, ...newData};
       // setLoading(false);
    
      }
     // setLoading(false);   
    }
    console.log('timerRef.current---'+timerRef.current+'======='+ compressLoading)
    //console.log("final data-->"+JSON.stringify(dataToSend))
    //if(!(compressLoading) && !(timerRef.current))
    if((compressLoading == false) && (timerRef.current == false))
   // if(!compressLoading && newsType == 'V')
     {
      console.log('timerRef.current---'+timerRef.current)
      console.log("final data again-->"+JSON.stringify(dataToSend))
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
           // setYoutubeVideoData({});
            // setVideoId('');
            // setUploadedStatus('');
            // setVideoimageUrl('');
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
  }
  const uploadFileInChunks = async (filePath, chunkSize, uploadUrl) => {
    try {
    const stats = await RNFS.stat(filePath);
    const fileSize = stats.size;
    
    let offset = 0;
    
    while (offset < fileSize) {
    const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('offset', offset.toString());
    formData.append('totalSize', fileSize.toString());
    
    await axios.post(uploadUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' } });
    offset += chunkSize;
    }
    console.log('Upload complete');
    } catch (error) {
    console.error('Error during chunk upload:', error);
    }
    };
  return (
    <ScrollView>
    <View style={styles.container}>
    <Loader loading={loading} />
    <Loader loading={compressLoading} />
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
