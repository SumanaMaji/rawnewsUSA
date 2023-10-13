import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const ImageList = props => {
  let menuRef = useRef([]);
  return (
    <MenuProvider>
      <View style={styles.cardimagediv}>
        {props.images.map((img, idx) => {
          return (
            //   <TouchableOpacity key={idx} onPress={() => props.removeImageHandler(img.Id)}>
            //   <Image style={styles.cardimage} source={{uri: img.uri}} />
            // </TouchableOpacity>
            <Menu key={idx} ref={r => (menuRef[idx] = r)}>
              <MenuTrigger
                customStyles={{
                  triggerTouchable: {
                    onPress: () => {
                      console.log('trigger');
                      menuRef[idx].open();
                    },
                  },
                }}>
                <Image style={styles.cardimage} source={{uri: img.uri}} />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => props.removeImageHandler(img.Id)}>
                  <Text style={{color: 'red', fontSize: 25}}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          );
        })}
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  cardimagediv: {
    paddingBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardimage: {
    height: 100,
    width: 100,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ImageList;
