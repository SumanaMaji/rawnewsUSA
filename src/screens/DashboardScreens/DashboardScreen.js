import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomColors} from '../../constants/CustomColors/CustomColors';
// import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DashboardScreen = ({navigation}) => {
  // navigation.setOptions({
  //   headerTitle: ' Divisions',
  //   headerTintColor: 'white',
  //   headerStyle: {
  //     backgroundColor: CustomColors.lightblue,
  //   },
  // });
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.green]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ExclusiveNewsScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="cube-outline" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}> Exclusive News</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.orange]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ReportScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="file-table-outline" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}> Add Content</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, styles.lightblue]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NewsDetailsScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="file-find-outline" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}> Details</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, styles.red]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MasterDataEntryScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="database" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}>Place Your Ad</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, styles.cyan]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserManagmentScreen');
          }}>
          <View style={styles.leftnright}>
            <View>
              <FontAwesome size={45} name="account-plus" />
            </View>
            <View style={styles.commonTextWrapper}>
              <Text style={styles.text}>Getting paid to upload Articles/Video</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

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
