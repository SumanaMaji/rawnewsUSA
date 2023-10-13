import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Urls from '../../constants/ConstantVariables/Urls';
import Loader from '../../Components/Loader/Loader';

const TransactionImage = props => {
  const [loading, setLoading] = useState(false);
  const [loadingLargeImage,setLoadingLargeImage] = useState(false);
  const [photo, setPhoto] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLargeImageModal, setShowLargeImageModal] = useState(false);
  const [largeImageData, setLargeImageData] = useState();

  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    getThumbnail().then(response => setPhoto(response));
  }, []);

  const readData = async user_token => {
    try {
      const userToken1 = await AsyncStorage.getItem(user_token);
      if (userToken1 !== null) {
        setUserToken(userToken1);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage');
    }
  };

  const getThumbnail = () => {
    setLoading(true);
    if (userToken.length == 0) {
      readData('user_token');
    }

    return fetch(Urls.getTransactionThumbnail + props.transId + '/thumbnail', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Host: 'escrap-api.herokuapp.com',
        Authorization: `Bearer ${userToken}`,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          setLoading(false);
          let data = responseJson.thumbnail;
          let newData = [];
          data.map((obj, index) => {
            newData.push(obj.thumbnail);
          });
          return data;
        } else {
          console.log('Something went wrong while fetching thumbnail data');
          return 'error';
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const showLargeImage = imageId => {
    setLoadingLargeImage(true);
    setLargeImageData();
    setShowImageModal(true);
    if (userToken.length == 0) {
      readData('user_token');
    }
    fetch(Urls.getTransactionThumbnail + imageId + '/image', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Host: 'escrap-api.herokuapp.com',
        Authorization: `Bearer ${userToken}`,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          setLoadingLargeImage(false);
          let data = responseJson.image.image;
          setLargeImageData(data);
        } else {
          console.log('Something went wrong while fetching large image data');
          return 'error';
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const hideActiveModal = () => {
    setLoading(false);
    setShowImageModal(false);
  };
  return (
    <View style={styles.cardimagediv}>
      <Loader loading={loading} />
      <FlatList style={styles.flatListStyle} data={photo} numColumns={3} renderItem={({item})=>{ return (
      <View>
          <TouchableOpacity
            key={item.imageId}
            onPress={() => showLargeImage(item.imageId)}>
            <Image
              style={styles.cardimage}
              source={{
                uri: 'data:image/png;base64,' + item.thumbnail,
              }}
            />
          </TouchableOpacity>
        </View>
        )}
      } />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          hideActiveModal();
        }}>
          
        <Loader loadingLargeImage={loadingLargeImage} />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.cardimageLarge}
              source={{
                uri: 'data:image/png;base64,' + largeImageData,
              }}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => hideActiveModal()}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardimagediv: {
    paddingBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardimage: {
    height: 100,
    width: 100,
    marginTop: 4,
    marginLeft: 4,
  },
    flatListStyle: { flex: 1,
    },
  cardimageLarge: {
    height: 450,
    width: 320,
    marginTop: -10,
    marginLeft: -10,
    marginBottom: 4,
  },
  buttonClose: {
    height: 55,
    width: 150,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 15,
  },
  textStyle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop:30
  },
});

export default TransactionImage;