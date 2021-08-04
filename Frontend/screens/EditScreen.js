import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground,
         TouchableOpacity, TextInput} from 'react-native';

import BackButton from '../components/BackButton';
import ItemInfoScreen from './ItemInfoScreen';

const EditScreen = ({ route, navigation }) => {
  const item = route.params.item;
  const [name, setName] = useState(item.Name);
  const [brand, setBrand] = useState(item.Brand);
  const [model, setModel] = useState(item.Model);
  const [category, setCategory] = useState(item.Category);
  const [location, setLocation] = useState(item.Location);
  const [replacement, setReplacement] = useState(item.Replacement);
  const [message, setMessage] = useState('');

  const back = () => {
    navigation.pop();
  };

  const handleEdit = async () =>
  {
    var obj =
    {
      userId: global.userId,
      Name: name,
      Brand: brand,
      Model: model,
      Category: category,
      Location: location,
      Replacement: replacement,
      Serial: item.Serial,
      itemId: item.itemId,
      jwtToken: global.jwtToken
    }

    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch('https://cop-4331-16.herokuapp.com/api/edititem',
        {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if (res.error != 0)
      {
        console.log(res.error);
        setMessage("An error occured, please try again.");
      }
      else
      {
        global.jwtToken = res.jwtToken;
        setVariables();
        setUpdatedList();
      }
    }
    catch(e)
    {
      console.log("error : " + e);
    }
  };

  const setUpdatedList = async () =>
  {
    var obj = {userId: global.userId};
    var js = JSON.stringify(obj);

    try
    {
        const response = await fetch('https://cop-4331-16.herokuapp.com/api/search',
            {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

        var res = JSON.parse(await response.text());
        console.log(res);

        if (res.error != 0)
        {
            console.log("Error retrieving new list");
        }
        else
        {
            global.fullList = res.arr;
            navigation.push('ItemAfterEditScreen', {item : item});
        }
    }
    catch(e)
    {
        console.log("error : " + e);
    }
  };

  const setVariables = () =>
  {
    item.Name = name;
    item.Brand = brand;
    item.Model = model;
    item.Category = category;
    item.Location = location;
    item.Replacement = replacement;
    console.log("Changed: " + item);
  }

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
          Edit Asset Specs.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textField}>Name:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Name"
          editable={true}
          value={name}
          placeholderTextColor='silver'
          onChangeText={(val) => setName(val)}
        />
        <Text style={styles.textField}>Brand:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Brand"
          value={brand}
          placeholderTextColor='silver'
          onChangeText={(val) => setBrand(val)}
        />
        <Text style={styles.textField}> Model:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Model"
          value={model}
          placeholderTextColor='silver'
          onChangeText={(val) => setModel(val)}
        />
        <Text style={styles.textField}>      Category:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Category"
          value={category}
          placeholderTextColor='silver'
          onChangeText={(val) => setCategory(val)}
        />
        <Text style={styles.textField}>      Location:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Location"
          value={location}
          placeholderTextColor='silver'
          onChangeText={(val) => setLocation(val)}
        />
        <Text style={styles.textFieldRep}>Replacement Value:</Text>
        <TextInput style={styles.placeHolder} 
          placeholder="Replacement Value"
          value={replacement}
          placeholderTextColor='silver'
          keyboardType='number-pad'
          onChangeText={(val) => setReplacement(val)}
        />
        <TouchableOpacity onPress={handleEdit}>
          <View style={styles.buttomButton}>
            <View style={styles.editButton}>
              <Text style={styles.editText}>Confirm Edit</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>{message}</Text>
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
    paddingLeft: 30,
    paddingTop: 15
  },
  subtitleText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    color: 'white'
  },
  subtitleContainer: {
    paddingLeft: 15,
    paddingTop: 2
  },
  backContainer: {
    paddingLeft: 30,
    paddingTop: 35
  },
  inputContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
  },
  placeHolder: {
    height: 45, 
    width: 317, 
    borderColor: 'silver', 
    borderRadius: 7, 
    borderWidth: 1,  
    backgroundColor: 'transparent',
    marginBottom: 20, color: 'silver',
    paddingLeft: 20
  },
  editButton: {
    height: 45,
    width: 317,
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  editText: { 
    color: 'black',
    //fontWeight: 'bold',
    fontSize: 17,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  buttomButton: {
    paddingTop: 25
  },
  text: { 
    color: 'silver',
    fontSize: 14,
    //flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    paddingTop: 7
  },
  textField: {
    color: 'silver',
    fontSize: 14,
    paddingRight: 280,
    paddingBottom: 5,
    fontWeight: 'bold'
  },
  textFieldRep: {
    color: 'silver',
    fontSize: 14,
    paddingRight: 200,
    paddingBottom: 5,
    fontWeight: 'bold'
  }
});

export default EditScreen;
