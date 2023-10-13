import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
const MasterDataEntryScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: ' Master',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: CustomColors.lightblue,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.orange]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddDivisionScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="list-alt" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}> Division</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.lightblue]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddTypeScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="keyboard-o" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}> Type</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.green]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddSubTypeScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="clone" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}>Sub Type</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MasterDataEntryScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CustomColors.background,
    height: '100%',
  },
  card: {
    marginTop: 10,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '96%',
    height: '18%',
    borderRadius: 10,
    elevation: 3,
  },
  green: {backgroundColor: CustomColors.green},
  orange: {backgroundColor: CustomColors.orange},
  lightblue: {backgroundColor: CustomColors.lightblue},
  red: {backgroundColor: CustomColors.red},
  cyan: {backgroundColor: CustomColors.cyan},

  leftnright: {
    // display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 15,
    // marginTop: 10,
  },
  commonTextWrapper: {
    marginTop: 3,
    width: 282,
    height: 40,
    textAlign: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',

    color: '#333',
  },
});
