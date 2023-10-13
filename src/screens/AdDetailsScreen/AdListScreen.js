import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList,TouchableOpacity, ScrollView,Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import * as Urls from '../../constants/ConstantVariables/Urls';
import { block } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdListScreen({navigation}) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [userId, setUserId] = useState();
 
  useEffect(() => {
    readUserId('user_id');
  }, [userId]);

  const readUserId = async user_id => {
    try {
      const userId1 = await AsyncStorage.getItem(user_id);
      if (userId1 !== null) {
        setUserId(userId1);
       }
       else{
        navigation.navigate('LoginScreen');
       }
     } catch (e) {
       alert('Failed to fetch the data from storage');
     }
  };
  const fetchData = async (val) => {
    fetch(Urls.adSearch+'?data={"data":{"search":"'+val+'"}}', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error == 0) {
            let data = responseJson.data.business;
            const newData = [];
            const d = Array();
            {
              data.map((obj, index) => {
                let divNm = obj.business_name;
               if (obj.business_name && d[index - 1] != divNm) {
                  newData.push({business_name: obj.business_name, id: obj.id, imageSrc: obj.small_banner_image});
                  d.push(divNm);
               }
              });
            }
            console.log(JSON.stringify(newData))
            setData(newData);
          } else {
            setData([]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    
   // const res = await fetch('https://api.opendota.com/api/heroes');
    //const json = await res.json();
   // setData(json);
   // setHeroes(json.slice());
  };
  

  const filterNames = (hero) => {
    //console.log(heroes.length);
      let search = query.toLowerCase().replace(/ /g,"_");
      if(hero.name.startsWith(search, 14)){
        return formatNames(hero);
      }else{ 
        heroes.splice(heroes.indexOf(hero), 1);
        return null;
      }
  }

  const formatNames = (hero) =>{
    let heroName = hero.name.charAt(14).toUpperCase() + hero.name.slice(15);
    heroName = heroName.replace(/_/g, " ");
    return heroName;
  }

  const updateQuery = (input) => {
   // setHeroes(data.slice());
   fetchData(input);
    setQuery(input);
  }
const goToAds = (id) => {
    navigation.navigate('AdDetailsScreen', { itemId: id, });
}
const rendSearch = (item) => {
  return (
    <TouchableOpacity style={styles.flatList} onPress={() => goToAds(item.id)}>
      <Text style={styles.flatListtxt}>{item.business_name}</Text>
      <Image
          source={{
            uri: item.imageSrc,
            }}
          style={styles.mainImg}
          />
    </TouchableOpacity>
  );
}
  return (
    <View style={styles.searchBox}>
    <View style={styles.autocompleteContainer}>
      <SearchBar
          onChangeText={updateQuery}
          value={query}   
          placeholder="Type Here..."
          inputStyle={{backgroundColor: 'white'}}
          inputContainerStyle={{backgroundColor: 'white'}}
         containerStyle={{backgroundColor: 'white',borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
      />
      <FlatList data={data} keyExtractor = {(i)=>i.id.toString()}
        extraData = {query} 
        style={styles.flatListContainer}
        renderItem = {({item, index}) => 
          rendSearch(item)
        
        } />
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  flatList:{
    marginTop:5, 
    marginBottom: 10,
    paddingBottom:5,
    fontSize: 20,
    borderBottomColor: '#26a69a',
    borderBottomWidth:1,
   
},
flatListContainer: {
  marginVertical: 8,
    marginHorizontal: 0,
    paddingHorizontal:5
   
},
searchBox: {
  width: "100%",
  height:'100%',
},
searchText: {
    backgroundColor:'white',
},

autocompleteContainer: {
  flex: 1,
  flexDirection:'column',
  position: 'absolute',
  width: '100%',
  height:'100%',
  
},
flatListtxt: {
flex:1,
width:'100%',
fontSize:18
},
mainImg: {
    flex: 1,
    width: '100%',
    height: 70,
    alignItems: 'center',
    marginTop:10,

marginBottom:10,
  },

});