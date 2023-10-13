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
  const [newsVideosuccess,setNewsVideoSuccess] = useState(false);
  const [userId, setUserId] = useState();
  const [pushData, setPushData] = useState();
  const [newsData, setNewsData] = useState();
  const [settingsData, setSettingsData] = useState();
  const [compressloading,setCompressLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [videoimageUrl, setVideoimageUrl] = useState('');
  const [uploadedStatus, setUploadedStatus] = useState();
  const [youtubeVideoData, setYoutubeVideoData] = useState({});
  const [videoIdYoutube, setVideoIdYoutube] = useState();
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


    //clearTimeout(timerRef.current);
    //setYoutubeVideoData(testdata);
   // console.log("youtubeVideoData--"+JSON.stringify(youtubeVideoData));

//     {youtubeVideoData.length>0&&
//       <tr>
//              <th></th>
//              {Object.keys(youtubeVideoData[0]).map((item) => {
//                (item.id )? setVideoId(item.id) : setVideoId('');
//                (item.status.uploadStatus) ? setUploadedStatus(item.status.uploadStatus) : setUploadedStatus('failed');
//       (item.snippet.thumbnails.high.url) ? setVideoimageUrl(item.snippet.thumbnails.high.url) : setVideoimageUrl('');
//  console.log("hhhh"+item)
//                return <th key={item}>{item}</th>;
//              })}
//            </tr>
//      }

    // if(youtubeVideoData)
    // {
    //   (youtubeVideoData.id) ? setVideoId(youtubeVideoData.id) : setVideoId('no');
    //   (youtubeVideoData.status?.uploadStatus) ? setUploadedStatus(youtubeVideoData.status.uploadStatus) : setUploadedStatus('failed');
    //   (youtubeVideoData.snippet?.thumbnails?.high?.url) ? setVideoimageUrl(youtubeVideoData.snippet.thumbnails.high.url) : setVideoimageUrl('none');
    //   console.log("aaalll2222----"+'----'+videoId+'+----'+uploadedStatus+'-------'+videoimageUrl);
    // }
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
  const videoAllDataYoutube = async (val) => {
    //console.log('Clicked ID:', val)
    (val.id) ? setVideoId(val.id) : setVideoId('');
    // (val.snippet.thumbnails.high.url) ? await setVideoimageUrl(val.snippet.thumbnails.high.url) : setVideoimageUrl('');
    // (val.status.uploadStatus) ? await setUploadedStatus(val.status.uploadStatus) : setUploadedStatus('');
   // console.log("aaalll44444----"+'----'+videoId+'----'+uploadedStatus+'==='+videoimageUrl);
    console.log("aaalll44444----"+'----'+videoId+'----');
}
const videoIDSet = async (val) => {
  //console.log('Clicked ID:', val)
  (val) ?  setVideoId(val) : setVideoId('');
  //console.log("aaalll55555----"+'----'+videoId+'----'+uploadedStatus+'==='+videoimageUrl);
  console.log("aaalll55555----"+'----'+videoId+'----');


  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        rivers[name]
      )
    }, 1500)
  })

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
          // console.log('accessToken'+accessToken);
//           var uploader = new YTDAPI({
//             baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
//             file: file,
//             token: accessToken,
//            // token: 'ya29.a0AbVbY6MQlNOLcD5vE7qNgL-dw77bwMYKogi_WQ3wltJ4QKHSQrkQvs6knYdDy6i1qQDr7-Tm0Lg0m6YTunUd-RrE--0L0VLyorsa4R_2q4tPf6JJVFpfVEdezRkR3VoUjyjhjBkoq2_D5cjiSi1G68rX4u1B1kGPaCgYKATQSARISFQFWKvPlf3O73ssOQJBAg6VQzrjvfg0167',
//             metadata: metadata,
//             params: {
//               part: Object.keys(metadata).join(',')
//             },
//             onError: function(data) {
//               console.log(data);
//               var message = data;
//               try {
//               var errorResponse = JSON.parse(data);
//               message = errorResponse.error.message;
//               } finally {
//               alert('Oops!Something wrong...Please try again later');
//               }
//             }.bind(this),
//             onProgress: function(data) {
//               setLoading(true);
//               var currentTime = Date.now();
//               var bytesUploaded = data.loaded;
//               var totalBytes = data.total;
//               var bytesPerSecond = bytesUploaded / ((currentTime - window.uploadStartTime) / 1000);
//               var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
//               var percentageComplete = (bytesUploaded * 100) / totalBytes;
//               console.log("Uploaded: " + bytesUploaded + " | Total: " + totalBytes + " | Percentage: " + percentageComplete + " | Esitmated seconds remaining: " + estimatedSecondsRemaining);        
//             }.bind(this),
//             onComplete: function(data) {
//              // timerRef.current = setTimeout(() => setLoading(false), 1000);
//             //  timerRef.current = setTimeout(() => setVideoAllDataYoutube(data), 1000);
//           // timerRef.current = setTimeout(() => setYoutubeVideoData(data), 1000);
//             //videoAllDataYoutube(data);
//           // youtubeVideoData.id ? setVideoId(youtubeVideoData.id) : setVideoId('');
// //           const json =  data.json();
// // console.log("uploadStatus==="+ json);
//            // setYoutubeVideoData(data);
//          // setVideoIdYoutube(data.id, videoIDSet);
//              setLoading(false);
//             // const statusUP =  Object.keys(data).map((key, index) => {
//             //   return { uploadedStatus: data[key].uploadedStatus }} );
//             //   setUploadedStatus({statusUP});
//             //   console.log("aaall55555l----"+'----'+uploadedStatus);

//               console.log("Complete"+data);

//               Object.entries(data).forEach(([key, value]) => {
//                 if (key == "id") {
//                   var id = value;
//                   setVideoId(id);
//                 }
//                 if (key == "snippet") {
//                   var snippet = value;
//                   Object.entries(snippet).forEach(([key1, value1]) => {
//                     console.log(`${key1} ${value1}`);
//                     if (key1 == "thumbnails") {
//                       var thumbnails = value1;
//                       Object.entries(thumbnails).forEach(([key2, value2]) => {
//                         console.log(`${key2} ${value2}`);
//                         if (key2 == "high") {
//                           var high = value2;
//                           //console.log("high----"+high);
//                           Object.entries(high).forEach(([key3, value3]) => {
//                             console.log(`${key3} ${value3}`);
//                             if (key3 == "url") {
//                               var url = value3;
//                               setVideoimageUrl(url)
//                               console.log("url----"+url);
//                             }
//                           });
//                         }
//                       });
//                     }
//                   });
//                 }
//                 if (key == "status") {
//                   var status = value;
//                   Object.entries(status).forEach(([key1, value1]) => {
//                     console.log(`${key1} ${value1}`);
//                     if (key1 == "uploadStatus") {
//                       var ustatus = value1;
//                       setUploadedStatus(ustatus);
//                       console.log(ustatus);
//                     }
//                   });
//                 }
//               });

//               ToastAndroid.show(
//                 'Video Uploaded successfully.',
//                 ToastAndroid.LONG,
//               );
//                //  if(youtubeVideoData){
//           //       youtubeVideoData.id ? setVideoIdYoutube(youtubeVideoData.id) : setVideoId('');
//           //           youtubeVideoData.status.uploadStatus ? setUploadedStatus(youtubeVideoData.status.uploadStatus) : setUploadedStatus('');
//           // console.log("aaalll----"+'----'+videoId+'+----'+uploadedStatus+'-------'+videoimageUrl);
//             }.bind(this)
//           });
      
//           window.uploadStartTime = Date.now();
//           uploader.upload();
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
 // console.log("data--"+data);
  // console.log("Complete--"+ JSON.stringify(responseData));
  // console.log("CompleteIDDDD--"+responseData.id+'-----'+responseData.status.uploadStatus+'-----'+responseData.nippet.thumbnails.high.url);

  //responseData.id ? setVideoIdYoutube(responseData.id) : setVideoId('no');
  // responseData.status?.uploadStatus ? setUploadedStatus(responseData.status?.uploadStatus) : setUploadedStatus('none');
  // responseData.snippet?.thumbnails?.high?.url ? setVideoimageUrl(responseData.snippet.thumbnails.high.url) : setVideoimageUrl('none');
  if(Object.keys(responseData).length > 0){
  Object.entries(responseData).forEach(([key, value]) => {
    if (key == "id") {
      var id = value;
      setVideoId(id);
      
    }
    console.log('iddd--->'+videoId+'<--'+'--'+key+'----'+value+'----'+id)
    if (key == "snippet") {
      var snippet = value;
      Object.entries(snippet).forEach(([key1, value1]) => {
       // console.log(`${key1} ${value1}`);
        if (key1 == "thumbnails") {
          var thumbnails = value1;
          Object.entries(thumbnails).forEach(([key2, value2]) => {
           // console.log(`${key2} ${value2}`);
            if (key2 == "high") {
              var high = value2;
              //console.log("high----"+high);
              Object.entries(high).forEach(([key3, value3]) => {
                //console.log(`${key3} ${value3}`);
                if (key3 == "url") {
                  var url = value3;
                  setVideoimageUrl(url)
                  console.log("url----"+videoimageUrl);
                }
              });
            }
          });
        }
      });
    }
    if (key == "status") {
      var status = value;
      Object.entries(status).forEach(([key1, value1]) => {
       // console.log(`${key1} ${value1}`);
        if (key1 == "uploadStatus") {
          var ustatus = value1;
          setUploadedStatus(ustatus);
          console.log("uploadstatus---"+uploadedStatus);
        }
      });
    }
  });
}
  else{
console.log("responseData---"+responseData)
  }
  //setNewsVideoSuccess(true);
  ToastAndroid.show(
    'Video Uploaded successfully.',
    ToastAndroid.LONG,
  );
  setCompressLoading(false);
  timerRef.current = false;

  console.log('Upload finished---'+videoId+'----'+uploadedStatus+'-----'+'----'+videoimageUrl)       
 }.bind(this)
        
        });
      
    
        window.uploadStartTime = Date.now();
        uploader.upload();
      
      //if(uploader.upload())
      //{
        console.log("aaalll222----"+'----'+videoId+'--'+uploadedStatus+'----'+videoimageUrl+'----'+newsType);

        if(uploadedStatus == 'uploaded')
        {
          //console.log('uploadedStatus--'+uploadedStatus);
          var newData = {
            youtube_video_id: videoId,
            youtube_video_image: videoimageUrl,
            mediatype: newsType
          }
        }
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
        dataToSend = {...dataToSend, ...newData};
       // setLoading(false);
    
      }
     // setLoading(false);   
    }
    if((!timerRef.current) && (newsType == 'V'))
   // if(!compressloading && newsType == 'V')
     {
      console.log('timerRef.current---'+timerRef.current)
      console.log("final data-->"+JSON.stringify(dataToSend))
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
            setVideoId('');
            setUploadedStatus('');
            setVideoimageUrl('');
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
 
  return (
    <ScrollView>
    <View style={styles.container}>
    <Loader loading={loading} />
    <Loader loading={compressloading} />
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
