import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CustomColors} from '../../constants/CustomColors/CustomColors';

import { StyleSheet,Modal,ScrollView } from 'react-native';

import { TouchableOpacity, Text,View } from 'react-native';
import * as Urls from '../../constants/ConstantVariables/Urls';

const CheckBoxKus = ({ selected, onPress, style, textStyle, size = 30, color = '#211f30', text = '', ...props}) => 
{
    const [showTermsModal,setShowTermsModal] = useState(false);
    const [termsText, setTermsText] = useState('');
    const showModal = () => {
        setShowTermsModal(true);
        fetch(Urls.getPages+'/?data={"data":{"pageId":"3"}}', {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.error == 0) {
                setTermsText(responseJson.data.pages.content);
              } else {
                alert(responseJson.error);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
    }

  const hideActiveModal = () => {
    setShowTermsModal(false);
  };
    return (
        <View style={styles.mainContainer}>
        <TouchableOpacity style={[styles.checkBox, style]} onPress={onPress} {...props}>
            <Icon 
                size={size}
                color={color}
                name={ selected ? 'check-box' : 'check-box-outline-blank'}
            />
        </TouchableOpacity>
           <TouchableOpacity onPress={showModal}>
                <Text style={styles.textStyle} > {text} </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={false}
                visible={showTermsModal}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                hideActiveModal();
                }}>
            <ScrollView>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text>{termsText}</Text>
                <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => hideActiveModal()}>
                <Icon name="close" size={30} color="white" />
                </TouchableOpacity>
            </View>
            </View>
            </ScrollView>
      </Modal>
        </View>
    );
}

export default CheckBoxKus;
const styles = StyleSheet.create({
    mainContainer: {
        flexDirection:'row',
        height:35,
        marginTop:10
    },
    checkBox: {
        alignItems: 'center'
    },
    textStyle:{
        color:CustomColors.blue,
        fontSize:16,
        paddingTop:5
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
    marginTop: 30,
  },
  buttonClose: {
    position: 'absolute',
    // left: 280,
    right: 25,
    top: 20,
    // bottom: 33,
    backgroundColor: 'red',
    borderRadius: 9,
  },
})