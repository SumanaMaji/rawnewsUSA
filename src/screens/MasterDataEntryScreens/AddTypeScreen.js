import React, {useState, createRef, useEffect} from 'react';
import {
  Keyboard,
  Modal,
  Picker,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTypeScreenList from './AddTypeScreenList';
import * as Urls from '../../constants/ConstantVariables/Urls';
import Loader from '../../Components/Loader/Loader';
import {CustomColors} from '../../constants/CustomColors/CustomColors';

const AddTypeScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: ' Types',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: CustomColors.lightblue,
    },
  });
  const [userToken, setUserToken] = useState('');
  const [name, setName] = useState('');
  const [isTypeSuccess, setIsTypeSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [division, setDivision] = useState([]);
  const [selecteDivision, setSelecteDivision] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [typeId, setTypeId] = useState('');
  const [customId, setCustomId] = useState('');
  const [types, setTypes] = useState([]);
  const nameInputRef = createRef();

  useEffect(() => {
    AsyncStorage.getItem('user_token').then(value => getDivision(value));
    getAllTypes();
  }, []);

  const getAllTypes = () => {
    setLoading(true);
    fetch(Urls.getAllTypes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.data.length) {
          let typeData = [];
          response.data.forEach(d => {
            typeData.push({
              Id: d._id,
              DivisionId: d.divisionId,
              TypeId: d.typeId,
              TypeName: d.typeName,
            });
          });
          setTypes(typeData);
          setLoading(false);
        } else {
          setTypes([]);
        }
      })
      .catch(error => {
        alert('There is an error while fetching types.');
        console.log(error);
      });
  };

  const deleteType = typeId => {
    Alert.alert('Are your sure?', 'You want to delete this type?', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          fetch(Urls.deleteType + '/' + typeId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          })
            .then(response => response.json())
            .then(response => {
              getAllTypes();
            });
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
      },
    ]);
  };

  const getDivision = value => {
    setUserToken(value);
    fetch(Urls.getAllDivisions, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${value}`,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          let data = responseJson.data;
          var oldIndex = '';
          const newData = [];
          const d = Array();
          {
            data.map((obj, index) => {
              if (d[index - 1] != obj.divisionName) {
                newData.push({label: obj.divisionName, value: obj._id});
                d.push(obj.divisionName);
              }
            });
          }
          setDivision(newData);
        } else {
          console.log('Please check your user name or password');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const setEditMode = typeId => {
    setIsEditMode(true);
    let record = types.filter(d => {
      return d.Id == typeId;
    });
    setTypeId(typeId);
    setSelecteDivision(record[0].DivisionId);
    setName(record[0].TypeName);
    setCustomId(record[0].TypeId);
    setOpenModal(true);
  };

  const resetHandler = () => {
    setSelecteDivision('');
    setName('');
    setCustomId('');
    setOpenModal(false);
    setIsEditMode(false);
  };

  const handleSubmitButton = () => {
    setErrortext('');
    if (!selecteDivision) {
      alert('Please select Division');
      return;
    }
    if (!name) {
      alert('Please fill Name');
      return;
    }
    //Show Loader
    setLoading(true);
    let typId = isEditMode ? customId : Date.now();
    var dataToSend = {
      divisionId: selecteDivision,
      typeId: typId,
      typeName: name,
    };
    let url = isEditMode ? Urls.updateType + '/' + typeId : Urls.createType;
    fetch(url, {
      method: isEditMode ? 'PUT' : 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        if (responseJson.success) {
          setIsTypeSuccess(true);
          let alertMessage = isEditMode
            ? 'Type updated successfully.'
            : 'Type added successfully.';
          alert(alertMessage);
          getAllTypes();
          resetHandler();

          // navigation.navigate('MasterDataEntryScreen');
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  return (
    <>
      <ScrollView style={{marginTop: 15}}>
        <AddTypeScreenList
          typeList={types}
          deleteTypeHandler={deleteType}
          updateTypeHandler={setEditMode}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          resetHandler();
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.subcontainer}>
              <View style={styles.input}>
                <Picker
                  selectedValue={selecteDivision}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelecteDivision(itemValue)
                  }
                  mode="dropdown">
                  <Picker.Item label="Select Division" value="" />
                  {division.map((rowData, index) => (
                    <Picker.Item label={rowData.label} value={rowData.value} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                autoCapitalize="none"
                placeholderTextColor="black"
                onChangeText={Name => setName(Name)}
                ref={nameInputRef}
                returnKeyType="next"
                value={name}
                onSubmitEditing={() =>
                  nameInputRef.current && nameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
              <View style={styles.btngrp}>
                <TouchableOpacity
                  style={styles.cancelbtn}
                  onPress={() => {
                    resetHandler();
                  }}>
                  <Text style={styles.btnText}> Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitbtn}
                  onPress={handleSubmitButton}>
                  <Text style={styles.btnText}> Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpenModal(true)}
        style={styles.touchableOpacityStyle}>
        <View style={styles.floatingButtonStyle}>
          <View style={styles.iconCenter}>
            <FontAwesome
              name="plus"
              size={30}
              color="white"
              style={styles.plusIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AddTypeScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    // backgroundColor: '#46d4c4',
    height: '100%',
    backgroundColor: 'white',
  },
  subcontainer: {
    marginTop: 18,
    alignContent: 'center',
  },
  input: {
    width: 350,
    height: 55,
    // backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btngrp: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelbtn: {
    height: 55,
    width: '40%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  submitbtn: {
    height: 55,
    width: '40%',
    backgroundColor: '#3492eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 50,
    bottom: 20,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    backgroundColor: CustomColors.green,
    borderRadius: 50,
  },
  iconCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
