import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import Card from '../../Components/Card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//fetch data from api

const AddDivisionDataList = props => {
  return (
    <SafeAreaView style={styles.container}>
      {props.divisionList.map(division => (
        <Card style={styles.divcard} key={division.Id}>
          <View style={styles.divcardname}>
            <Text style={styles.sectionTitle}>{division.Name} </Text>
            <Text style={styles.sectionTitle}>{division.ShortName} </Text>
          </View>
          <View style={styles.divcardbtn}>
            <TouchableOpacity
              onPress={() => props.editDivisionHandler(division.Id)}>
              <MaterialIcons name="edit" size={30} color="#841584" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.deleteDivisionHandler(division.Id)}>
              <MaterialIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </SafeAreaView>
  );
};

AddDivisionDataList.navigationOptions = {
  headerTitle: 'Division List',
};
export default AddDivisionDataList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    alignItems: 'center', // Centered horizontally
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  card: {
    height: 200,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
    flexDirection: 'row',
  },
  divcard: {flexDirection: 'row', padding: 10, width: '100%', margin: 2},
  divcardname: {flex: 1},
  editbtn: {marginTop: 5, backgroundColor: '#ccc'},
});
