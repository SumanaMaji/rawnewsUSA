import React, {useState, createRef, useEffect} from 'react';
import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader/Loader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AddDivisionDataList from './AddDivisionDataList';
import * as Urls from '../../constants/ConstantVariables/Urls';
import {CustomColors} from '../../constants/CustomColors/CustomColors';

const AddDivisionScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: ' Divisions',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: CustomColors.lightblue,
    },
  });
  const [unit, setUnit] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [city, setCity] = useState('');
  const [isDivisionSuccess, setIsDivisionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [userToken, setUserToken] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [divisionId, setDivisionId] = useState('');
  const [customId, setCustomId] = useState('');

  const nameInputRef = createRef();
  const unitInputRef = createRef();
  const shortNameInputRef = createRef();
  const cityInputRef = createRef();
  // modal handling
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user_token').then(value => setUserToken(value));
    getAllDivisions();
  }, []);

  const getAllDivisions = () => {
    setLoading(true);
    fetch(Urls.getAllDivisions, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.data.length) {
          let divisiondata = [];
          response.data.forEach(d => {
            divisiondata.push({
              Id: d._id,
              CustomId: d.divisionId,
              Unit: d.unit,
              Name: d.divisionName,
              ShortName: d.division,
              City: d.city,
            });
          });
          setDivisions(divisiondata);
          setLoading(false);
        } else {
          setDivisions([]);
        }
      })
      .catch(error => {
        alert('There is an error while fetching divisions.');
        console.log(error);
      });
  };
  const deleteDivision = divisionId => {
    Alert.alert('Are your sure?', 'You want to delete this division?', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          fetch(Urls.deleteDivision + '/' + divisionId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          })
            .then(response => response.json())
            .then(response => {
              getAllDivisions();
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
  const resetHandler = () => {
    setDivisionId('');
    setUnit('');
    setName('');
    setShortName('');
    setCity('');
    setCustomId('');
    setOpenModal(false);
    setIsEditMode(false);
  };
  const setEditMode = divisionId => {
    setIsEditMode(true);
    let record = divisions.filter(d => {
      return d.Id == divisionId;
    });
    setDivisionId(divisionId);
    setUnit(record[0].Unit);
    setName(record[0].Name);
    setShortName(record[0].ShortName);
    setCity(record[0].City);
    setCustomId(record[0].CustomId);
    setOpenModal(true);
  };
  const handleSubmitButton = () => {
    setErrortext('');
    if (!unit) {
      alert('Please fill Unit');
      return;
    }
    if (unit.length > 2) {
      alert('Unit length should not be more than 2 character.');
      return;
    }
    if (!name) {
      alert('Please fill Name');
      return;
    }
    if (!shortName) {
      alert('Please fill Short Name');
      return;
    }
    if (shortName.length > 2) {
      alert('Division shortname length should not be more than 2 character.');
      return;
    }
    if (!city) {
      alert('Please fill City');
      return;
    }
    //Show Loader
    setLoading(true);

    let cstmId = isEditMode ? customId : Date.now();
    var dataToSend = {
      divisionId: cstmId,
      unit: unit,
      divisionName: name,
      division: shortName,
      city: city,
    };
    //  dataToSend = {"divisionId": shortName+'321', "unit": unit, "divisionName": name, "division": shortName, "city": city};
    let url = isEditMode
      ? Urls.updateDivision + '/' + divisionId
      : Urls.createDivision;
    fetch(url, {
      method: isEditMode ? 'PUT' : 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
        // Host: 'escrap-test-api.herokuapp.com',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        // If server response message same as Data Matched
        if (responseJson.success) {
          getAllDivisions();
          setIsDivisionSuccess(true);
          let alertMessage = isEditMode
            ? 'Division updated successfully.'
            : 'Division added successfully.';
          alert(alertMessage);
          resetHandler();
          // navigation.navigate('MasterDataEntryScreen');
          console.log(alertMessage);
        } else {
          alert(responseJson.message);
          setErrortext('Registration Unsuccessful');
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
        <AddDivisionDataList
          divisionList={divisions}
          deleteDivisionHandler={deleteDivision}
          editDivisionHandler={setEditMode}
        />
      </ScrollView>
      <ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            // setModalVisible(!openModal);
            resetHandler();
          }}>
          <Loader loading={loading} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.subcontainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Unit"
                  autoCapitalize="none"
                  placeholderTextColor="black"
                  onChangeText={Unit => {
                    setUnit(Unit.slice(0, 2));
                  }}
                  ref={unitInputRef}
                  returnKeyType="next"
                  keyboardType="default"
                  value={unit.toString()}
                  onSubmitEditing={() =>
                    unitInputRef.current && unitInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                  // onChangeText={val => this.onChangeText('username', val)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
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
                  // onChangeText={val => this.onChangeText('username', val)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Short Name"
                  autoCapitalize="none"
                  placeholderTextColor="black"
                  onChangeText={ShortName => setShortName(ShortName)}
                  ref={shortNameInputRef}
                  returnKeyType="next"
                  value={shortName}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  // onChangeText={val => this.onChangeText('username', val)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  autoCapitalize="none"
                  placeholderTextColor="black"
                  onChangeText={City => setCity(City)}
                  ref={cityInputRef}
                  returnKeyType="next"
                  value={city}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  // onChangeText={val => this.onChangeText('username', val)}
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
      </ScrollView>
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

export default AddDivisionScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
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
