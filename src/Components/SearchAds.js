
import { StyleSheet, Text, View, FlatList,TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';

const SearchAds = ({navigation}) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
 
  const updateQuery = (input) => {
    //setHeroes(data.slice());
    navigation.navigate('AdListScreen');
    setQuery(input);
  }
  return (
    <View style={styles.searchBox}>
    <View style={styles.autocompleteContainer}>
      <SearchBar
          onChangeText={updateQuery}
          value={query}   
          placeholder="Type Here..."
          inputStyle={{backgroundColor: 'white'}}
          inputContainerStyle={{backgroundColor: 'white',height:25,}}
         containerStyle={{backgroundColor: 'white',borderBottomColor: 'transparent', borderTopColor: 'transparent',}}
      />
    </View>
    </View>
  );
}
export default SearchAds;
const styles = StyleSheet.create({
  flatList:{
    paddingLeft: 15, 
    marginTop:5, 
    paddingBottom:5,
    fontSize: 20,
    borderBottomColor: '#26a69a',
    borderBottomWidth:1,
   
    height:40,
},
flatListContainer: {
  backgroundColor:'red',
  marginVertical: 8,
    marginHorizontal: 16,
   
},
searchBox: {
  width: 275,
  marginTop:-50,
},
autocompleteContainer: {
  flex: 1,
  flexDirection:'column',
  alignSelf:'flex-start',
  position: 'absolute',
  width: '100%',
  overflow:'scroll',
  //height : 500,
  //zIndex: 999
},

});