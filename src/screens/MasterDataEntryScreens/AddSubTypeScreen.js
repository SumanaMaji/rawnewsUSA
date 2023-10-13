import React, {useState, createRef, useEffect} from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AddSubTypeScreenDataList from './AddSubTypeScreenDataList';
import * as Urls from '../../constants/ConstantVariables/Urls';
import Loader from '../../Components/Loader/Loader';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
const AddSubTypeScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: ' Sub Types',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: CustomColors.lightblue,
    },
  });
  const [userToken, setUserToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [name, setName] = useState('');
  const [subTypeId, setSubTypeId] = useState('');
  const [type, setType] = useState([]);
  const [selectType, setSelectType] = useState('');
  const nameInputRef = createRef();
  const [openModal, setOpenModal] = useState(false);
  const [subType, setsubType] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('user_token').then(value => getType(value));
    getAllSubTypes();
  }, []);

  const getAllSubTypes = () => {
    setLoading(true);
    fetch(Urls.getAllSubTypes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.data.length) {
          let subTypeData = [];
          response.data.forEach(d => {
            subTypeData.push({
              Id: d._id,
              SubTypeId: d.subTypeId,
              TypeId: d.typeId,
              SubTypeName: d.subTypeName,
            });
          });
          setsubType(subTypeData);
          setLoading(false);
        } else {
          setsubType([]);
        }
      })
      .catch(error => {
        alert('There is an error while fetching types.');
        console.log(error);
      });
  };
  //delete handler
  const deleteSubTypes = subTypesId => {
    Alert.alert('Are your sure?', 'You want to delete this type?', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          fetch(Urls.deleteSubType + '/' + subTypesId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          })
            .then(response => response.json())
            .then(response => {
              getAllSubTypes();
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
  const getType = value => {
    setUserToken(value);
    fetch(Urls.getAllTypes, {
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
              if (d[index - 1] != obj.typeName) {
                newData.push({label: obj.typeName, value: obj._id});
                d.push(obj.typeName);
              }
            });
          }
          setType(newData);
        } else {
          console.log('Please check your user name or password');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const setEditMode = subTypeId => {
    setIsEditMode(true);
    let record = subType.filter(d => {
      return d.Id == subTypeId;
    });
    setSubTypeId(subTypeId);
    setName(record[0].SubTypeName);
    setSelectType(record[0].TypeId);
    setOpenModal(true);
  };

  const resetHandler = () => {
    setSelectType('');
    setName('');
    setSubTypeId('');
    setOpenModal(false);
    setIsEditMode(false);
  };

  const handleSubmitButton = () => {
    setErrortext('');
    if (!selectType) {
      alert('Please select Type');
      return;
    }
    if (!name) {
      alert('Please fill Name');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      typeId: selectType,
      subTypeName: name,
    };

    let url = isEditMode
      ? Urls.updateSubType + '/' + subTypeId
      : Urls.createSubType;
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
          console.log('Successful');
          let alertMessage = isEditMode
            ? 'SubType updated successfully.'
            : 'SubType added successfully.';
          alert(alertMessage);
          getAllSubTypes();
          resetHandler();
          // navigation.navigate('MasterDataEntryScreen');
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };
  return (
    <>
      <ScrollView style={{marginTop: 15}}>
        <AddSubTypeScreenDataList
          subTypeList={subType}
          deleteHandler={deleteSubTypes}
          updateHandler={setEditMode}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!openModal);
        }}>
        <ScrollView style={styles.containerView}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.subcontainer}>
                <View style={styles.input}>
                  <Picker
                    selectedValue={selectType}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectType(itemValue)
                    }
                    mode="dropdown">
                    <Picker.Item label="Select Type" value="" />
                    {type.map((rowData, index) => (
                      <Picker.Item
                        label={rowData.label}
                        value={rowData.value}
                        key={index}
                      />
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
                  value={name}
                  returnKeyType="next"
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
        </ScrollView>
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

export default AddSubTypeScreen;

const styles = StyleSheet.create({
  containerView: {
    // backgroundColor: '#46d4c4',
    height: '100%',
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    // backgroundColor: '#46d4c4',
    height: '100%',
    backgroundColor: 'white',
    marginTop: '20%',
  },
  subcontainer: {
    marginTop: 18,
    alignContent: 'center',
    backgroundColor: 'white',
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
