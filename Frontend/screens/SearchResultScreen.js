import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet,
         ImageBackground, ScrollView,
         TouchableOpacity, TextInput, 
         FlatList, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import BackButton from '../components/BackButton';

const SearchResultScreen = ({ route, navigation }) => {
  const item = route.params.item;
  const [message, setMessage] = useState('');
  
  const back = () => {
    navigation.pop();
  };

  useEffect (() => 
  {
    const checkResults = () => 
    {
        if (item.length == 0)
        {
            setMessage("Item not found");
        }
        else if (item.length == 1)
        {
            setMessage("Item found");
        }
        else 
        {
            setMessage(item.length + " items found");
        }
    }

    checkResults();
  }, []);

  const Item = ({ item }) => (
    <TouchableOpacity onPress={() => itemHandler(item)}>
      <Text style={styles.item}>{item.Name + 
                                  "                                                            " + item.Location}</Text>
      <Text style={styles.serial}>{"S/N: " + item.Serial}</Text>
    </TouchableOpacity>
  ); 

  const itemHandler = (item) =>
  {
    navigation.push('ItemInfoScreen', {item : item});
  };

  return (
    <ImageBackground source={require('../img/MainBackground.jpg')}
                       style={styles.background}>
      <TouchableOpacity onPress={back}>
        <View style={styles.backContainer}>
            <BackButton></BackButton>
        </View>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Search Results.
        </Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          {message}
        </Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.assetContainer}>
          <FlatList
            data={item}
            renderItem={Item}
            keyExtractor={item => item._id}    
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
      flex: 1,
  },
  titleText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white'
  },
  titleContainer: {
    paddingLeft: 25,
    paddingTop: 20
  },
  backContainer: {
    paddingLeft: 25,
    paddingTop: 30
  },
  subtitleText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 36,
    color: 'white'
  },
  subtitleContainer: {
    paddingLeft: 25,
    paddingTop: 5
  },
  assetContainer: {
    //paddingBottom: 50,
    backgroundColor:  'rgba(28, 28, 28, 0.7)',
    borderRadius: 7,
    height: 550,
    width: 350,
  },
  tableContainer: {
    paddingTop: 20,
    paddingBottom: 50,
    paddingLeft: 18
  },
  item: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 20,
    paddingTop: 20,
    fontWeight: 'bold'
  },
  serial: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 20,
    paddingTop: 2,
    paddingBottom: 10
  },
});

export default SearchResultScreen;
