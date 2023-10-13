import React from 'react';
import {
  Keyboard,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CustomColors } from '../../constants/CustomColors/CustomColors';
const handleSubmitButton = () => {
  alert('Work in progress.');
}
const UserManagmentScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: ' User Managments',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: CustomColors.lightblue,
    },
  });
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.subcontainer}>
            <View style={styles.input}>
              <Picker >
                <Picker.Item
                  label="Select User Type"
                  value="Select User Type"
                />
                <Picker.Item label="Admin" value="admin"  />
                <Picker.Item label="User" value="user" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder=" Name"
              autoCapitalize="none"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              autoCapitalize="none"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Confirm Password"
              autoCapitalize="none"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              autoCapitalize="none"
              placeholderTextColor="black"
            />
            <View style={styles.btngrp}>
              <TouchableOpacity style={styles.submitbtn} onPress={handleSubmitButton}>
                <Text style={styles.btnText}> Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default UserManagmentScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    // backgroundColor: '#46d4c4',
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
  submitbtn: {
    height: 55,
    width: '62%',
    backgroundColor: '#0cb318',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});
