import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from 'react-native';
import Card from '../../Components/Card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const AddSubTypeScreenDataList = props => {
  return (
    <SafeAreaView style={styles.container}>
      {props.subTypeList.map(subType => (
        <Card style={styles.divcard} key={subType.Id}>
          <View style={styles.divcardname}>
            <Text style={styles.sectionTitle}>{subType.SubTypeName} </Text>
          </View>
          <View style={styles.divcardbtn}>
            <TouchableOpacity onPress={() => props.updateHandler(subType.Id)}>
              <MaterialIcons name="edit" size={30} color="#841584" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.deleteHandler(subType.Id)}>
              <MaterialIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </SafeAreaView>
  );
};

export default AddSubTypeScreenDataList;
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
