import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Modal,
  Picker,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import Loader from '../Loader/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Urls from '../../constants/ConstantVariables/Urls';
import ImageList from './ImageList';

const Transaction = props => {
  const [division, setDivision] = useState([]);
  const [userToken, setUserToken] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDivisionName, setSelectedDivisionName] = useState('');
  const [type, setType] = useState([]);
  const [selectType, setSelectType] = useState('');
  const [subtype, setSubType] = useState([]);
  const [selectSubType, setSelectSubType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [partyName, setPartyName] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const [entryDatePickerMode, setEntryDatePickerMode] = useState('date');
  const [entryDatePickerVisibility, setEntryDatePickerVisibility] =
    useState(false);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [referenceDatePickerMode, setReferenceDatePickerMode] =
    useState('date');
  const [referenceDatePickerVisibility, setReferenceDatePickerVisibility] =
    useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const partyNameInputRef = createRef();
  const referenceNumberInputref = createRef();
  const remarkInputRef = createRef();

  useEffect(() => {
    readData('user_token');
    getDivision();
    //getType();
    //getSubType();
  }, [userToken, division.length]);

  const resetScreen = () => {
    setSelectedDivision('');
    setSelectType('');
    setSelectSubType('');
    setVehicleNumber('');
    setPartyName('');
    setEntryDate(new Date());
    setEntryDatePickerVisibility(false);
    setReferenceDate(new Date());
    setReferenceNumber('');
    setRemarks('');
    setPhoto([]);
    setLoading('');
    setErrortext('');
  };

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

  const divisionChangeHandler = divId => {
    if(divId.length>0){
      setSelectedDivision(divId);
      let selectedDiv = division.filter(d => {
        return d.value == divId;
      });
      setSelectedDivisionName(selectedDiv[0].label);
      getType(divId);
    }
  };
 const typeChangeHandler = typeId => {
    if(typeId.length>0){
      console.log(typeId);
      setSelectType(typeId);
      getSubType(typeId);
    }
 }
  const getDivision = () => {
    setType('');
    setSelectType('');
    setSubType('');
    setSelectSubType('');

    //setUserToken(value);
    fetch(Urls.getAllDivisions, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        // Host: 'escrap-test-api.herokuapp.com',
        Authorization: `Bearer ${userToken}`,
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
              if (obj.division && d[index - 1] != obj.divisionName) {
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
  const getType = (divisionId) => {
    fetch(Urls.getAllTypesByDivision+"/"+divisionId, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          let data = responseJson.data;
          var oldIndex = '';
          const newData = [];
          {
            data.map((obj, index) => {
              newData.push({label: obj.typeName, value: obj._id});
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
  const getSubType = (typeId) => {
    setSubType('');
    setSelectSubType('');
    fetch(Urls.getAllTypesByType+"/"+typeId, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          let data = responseJson.data;
          var oldIndex = '';
          const newData = [];
          {
            if(data.length>0){
            data.map((obj, index) => {
              newData.push({label: obj.subTypeName, value: obj._id});
            });
            }
          }
          setSubType(newData);
        } else {
          console.log('Please check your user name or password');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const addPhotos = image => {
    if (photo.length) {
      let lastImage = photo.reduce((prev, current) => {
        return prev.Id > current.Id ? prev : current;
      });
      image.Id = lastImage.Id + 1;
    } else {
      image.Id = 1;
    }
    setPhoto([...photo, image]);

    // setPhoto(photo => ({
    //   ...photo,
    //   image
    // }));
  };

  const removeImage = id => {
    let images = photo.filter(img => {
      return img.Id != id;
    });

    setPhoto(images);
  };

  const selectMultipleFile = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          mediaType: 'image',
          includeBase64: true,
          compressImageQuality: 0.5,
        })
          .then(image => {
            addPhotos({
              base64: image.data,
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
            });
            // setPhoto({
            //   files: images.map(i => {
            //     console.log('received image', i);
            //     return {
            //       base64: i.data,
            //       uri: i.path,
            //       width: i.width,
            //       height: i.height,
            //       mime: i.mime,
            //     };
            //   }),
            // });
          })
          .catch(e => alert(e));
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onRefrenceDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || referenceDate;
    setReferenceDatePickerVisibility(Platform.OS === 'ios');
    setReferenceDate(currentDate);
  };

  const onEntryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || entryDate;
    setEntryDatePickerVisibility(Platform.OS === 'ios');
    setEntryDate(currentDate);
  };

  const showMode = (control, currentMode) => {
    if (control === 'referenceDate') {
      setReferenceDatePickerVisibility(true);
      setReferenceDatePickerMode(currentMode);
    } else if (control === 'entryDate') {
      setEntryDatePickerVisibility(true);
      setEntryDatePickerMode(currentMode);
    }
  };

  const showDatepicker = control => {
    showMode(control, 'date');
    console.log('dee');
  };

  const closeForm = () => {
    resetScreen();
    props.GateModeHandler(0);
  };
  const handleSubmitButton = () => {
    var gateOpt = props.GateMode;
    console.log(
      selectedDivision +
        '->' +
        selectType +
        '->' +
        selectSubType +
        '->' +
        remarks,
    );
    setErrortext('');
    if (!entryDate) {
      alert('Please fill Entry Date');
      return;
    }
    if (!vehicleNumber) {
      alert('Please fill Vehicle Number');
      return;
    }
    if (!partyName) {
      alert('Please fill Party Name');
      return;
    }
    if (!referenceDate) {
      alert('Please fill ERP Reference Date');
      return;
    }
    if (!referenceNumber) {
      alert('Please fill ERP Reference Number');
      return;
    }
    //Show Loader
    setLoading(true);
    let images = [];
    photo.forEach(fh => {
      images.push({
        // uri: Platform.OS === 'android' ? fh.uri : fh.uri.replace('file://', ''),
        base64: fh.base64,
      });
    });
    let dataToSend = {
      gateInOut: gateOpt,
      division: selectedDivision,
      divisionName: selectedDivisionName,
      id: 'transID',
      entryTypeMaster: selectType,
      entryTypeSubMaster: selectSubType,
      date: new Date(entryDate),
      vehicleNo: vehicleNumber,
      partyName: partyName,
      ERPRefDate: new Date(referenceDate),
      ERPRefNo: referenceNumber,
      remark: remarks,
      images: images,
    };

    fetch(Urls.submitTransaction, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.success) {
          //setIsTransactionSuccess(true);
          console.log('Transaction Added Successfully.');
          alert('Transaction Created successfully.');
          closeForm();
          // navigation.navigate('HomeScreen');
        } else {
          setErrortext('Failed to insert Transaction');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  return (
    <React.Fragment>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.GateMode > 0}
        // onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
        //   setinsideGate(!insideGate);
        // }}
      >
        <Loader loading={loading} />
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* <TouchableOpacity
                  style={styles.closebutton}
                  onPress={() => setinsideGate(false)}>
                  <MaterialCommunityIcons name="close-thick" size={45} />
                </TouchableOpacity> */}

                <View style={styles.input1}>
                  <Picker
                    dropdownIconColor="red"
                    dropdownIconRippleColor="purple"
                    selectedValue={selectedDivision}
                    onValueChange={(itemValue, itemIndex) =>
                      divisionChangeHandler(itemValue)
                    }
                    mode="dropdown">
                    <Picker.Item label="Select Division" value="" />
                    {(division.length > 0)  ? (
                    division.map((rowData, index) => (
                      <Picker.Item
                        key={'division' + index}
                        label={rowData.label}
                        value={rowData.value}
                      />
                    ))
                    ): null}
                  </Picker>
                </View>
                <View style={styles.input}>
                  <Picker
                    dropdownIconColor="red"
                    dropdownIconRippleColor="purple"
                    selectedValue={selectType}
                    onValueChange={(itemValue, itemIndex) =>
                      typeChangeHandler(itemValue)
                    }
                    mode="dropdown">
                    <Picker.Item label="Select Type" value="" />
                    {(type.length > 0)  ? (
                      type.map((rowData, index) => (
                      <Picker.Item
                        key={'type' + index}
                        label={rowData.label}
                        value={rowData.value}
                      />
                    ))
                    ): null}
                  </Picker>
                </View>
                <View style={styles.input}>
                  <Picker
                    //   style={[styles.onePicker]}
                    //   itemStyle={styles.onePickerItem}
                    dropdownIconColor="red"
                    dropdownIconRippleColor="purple"
                    selectedValue={selectSubType}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectSubType(itemValue)
                    }
                    mode="dropdown">
                    <Picker.Item label="Select Sub Type" value="" />
                    {(subtype.length > 0)  ? (
                    subtype.map((rowData, index) => (
                      <Picker.Item
                        key={'subType' + index}
                        label={rowData.label}
                        value={rowData.value}
                      />
                    ))
                    ): null
                    }
                  </Picker>
                </View>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    showDatepicker('entryDate');
                  }}>
                  <Text style={styles.dateText}>
                    {Moment(entryDate).format('DD-MMM-YYYY')}
                  </Text>
                </TouchableOpacity>
                {entryDatePickerVisibility && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={entryDate}
                    mode={entryDatePickerMode}
                    is24Hour={true}
                    display="calendar"
                    onChange={onEntryDateChange}
                  />
                )}
                <TextInput
                  style={styles.input}
                  onChangeText={VehicleNumber =>
                    setVehicleNumber(VehicleNumber)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Vehicle Number"
                  placeholderTextColor="black"
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    partyNameInputRef.current &&
                    partyNameInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={PartyName => setPartyName(PartyName)}
                  underlineColorAndroid="#f000"
                  placeholder="Party Name"
                  placeholderTextColor="black"
                  keyboardType="default"
                  ref={partyNameInputRef}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.input}
                  // color={CustomColors.red}
                  onPress={() => {
                    showDatepicker('referenceDate');
                  }}>
                  <Text style={styles.dateText}>
                    {Moment(referenceDate).format('DD-MMM-YYYY')}
                  </Text>
                </TouchableOpacity>
                {referenceDatePickerVisibility && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={referenceDate}
                    mode={referenceDatePickerMode}
                    is24Hour={true}
                    display="calendar"
                    onChange={onRefrenceDateChange}
                  />
                )}
                <TextInput
                  style={styles.input}
                  onChangeText={ReferenceNumber =>
                    setReferenceNumber(ReferenceNumber)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="ERP Reference Number"
                  placeholderTextColor="black"
                  autoCapitalize="sentences"
                  keyboardType="number-pad"
                  ref={referenceNumberInputref}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={Remarks => setRemarks(Remarks)}
                  underlineColorAndroid="#f000"
                  placeholder="Remark"
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  ref={remarkInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
                <ImageList removeImageHandler={removeImage} images={photo} />
                {errortext != '' ? (
                  <Text /*style={styles.errorTextStyle}*/> {errortext} </Text>
                ) : null}
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={styles.submitbtn}
                    activeOpacity={0.5}
                    onPress={handleSubmitButton}>
                    <Text style={styles.btnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => selectMultipleFile()}
                    style={styles.capturebtn}>
                    <FontAwesome
                      name="camera"
                      size={30}
                      color="white"
                      style={styles.plusIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.canceltbtn}
                    onPress={() => closeForm()}>
                    <Text style={styles.btnText}> Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input1: {
    width: 350,
    height: 55,
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
  },
  input: {
    width: 350,
    height: 55,
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 17,
    paddingTop: 7,
    fontWeight: 'bold',
  },
  btngrp: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  capturebtn: {
    height: 55,
    width: '20%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 15,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  btnContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitbtn: {
    height: 55,
    width: 120,
    backgroundColor: '#0cb318',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  canceltbtn: {
    height: 55,
    width: 120,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 15,
  },
});

export default Transaction;
