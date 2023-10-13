import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Modal,
} from 'react-native';
import TransactionImage from './TransactionImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function TransactionCard(props) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [photo, setPhoto] = useState([]);
  const [nNumber, setNNumber] = useState(0);
  useEffect(() => {
    setNNumber(nNumber+1);
    //console.log(props);
  }, []);
  const showActiveModel = modelName => {
    if (modelName == 'details') {
      setShowImageModal(false);
      setShowDetailsModal(true);
    } else {
      setShowImageModal(true);
      setShowDetailsModal(false);
    }
  };

  const hideActiveModal = () => {
    setShowImageModal(false);
    setShowDetailsModal(false);
  };
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <TouchableOpacity 
    onPress={() => props.goToNewsDetailsHandler(props.data.id)}>
      <View style={styles.maincard}>
        
      <View style={styles.cardnew}>
        <View style={styles.cardleft}>
          <View style={styles.cardinner}>
            <Text style={styles.cardhead}>{props.data.title}</Text>
            
          </View>
          <Image
            source={{
              uri: props.data.news_image,
            }}
            style={styles.mainImg}
          />
          <View style={styles.cardinner}>
        
            <Text style={styles.cardtext}>{props.data.content}</Text>
          </View>
          <View style={styles.lcd}>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="thumbs-up" size={17} /> Like</Text>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="comment" size={17} /> Comment</Text>
            <Text style={styles.cardtext}><FontAwesome style={styles.iconclr} name="share" size={17} /> Share</Text>
          </View>
        </View>
        
      </View>
      <TouchableOpacity onPress={() => props.goToAdDetailsHandler(props.data)} style={styles.adImgbox}>
      <Image
          source={require('../../assets/images/adimg.jpg')}
          style={styles.adImg}
        />
        </TouchableOpacity>
      
    </View>
    </TouchableOpacity>
    
  );
}
const styles = StyleSheet.create({
  iconclr: {
    marginTop: 15,
    color: '#000',
 
  },

  mainImg: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },

  lcd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:5,
    
  },

  location: {
    flexDirection: 'row',
    justifyContent:'space-around',
    alignContent: 'stretch',
    padding: 5,
  },
  locationext: {
     width:'100%',
     textAlign:'left',
     fontSize:18,
     marginLeft: 20,
  },
  temparaturess: {
    
    marginRight: 20,
    fontWeight: 'bold',
    fontSize:24,
  },
  maincard: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },

  cardview: {
    borderWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    width: '95%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
    shadowColor: '#cbcbcb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 2,  
    elevation: 5
  },
  cardnew: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    width: '95%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
    shadowColor: '#d9d9d9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5
  },
  cardleft: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  cardright: {
    
    
  },
  cardinner: {
    marginBottom: 2,
    padding: 5,
  },
  cardhead: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  cardtext: {
    color: '#333',
    fontSize: 20,
    marginBottom: 20,
  },
  cardimagediv: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  cardimage: {
    backgroundColor: '#ccc',
    height: 35,
    width: 35,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  btnContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitbtn: {
    height: 55,
    width: 150,
    backgroundColor: '#0cb318',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  adImg: {
    width: '93%',
    height:65,
  },
  adImgbox: {
    width: '93%',
    height:65,
    marginBottom: 10,
    marginTop:15
  }
  
});
