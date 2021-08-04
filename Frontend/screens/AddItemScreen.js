import React, {useState} from 'react';
import { Text, View, StyleSheet,
    ImageBackground, ScrollView,
    TouchableOpacity, TextInput, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import BackButton from '../components/BackButton';

const AddItemScreen = ({ navigation }) => {
    const [itemName, setItemName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [replacementValue, setReplacementValue] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [message, setMessage] = useState('');

    const back = () => {
        navigation.pop();
    };    

    const handleAdd = async () =>
    {
      var obj = 
      {
        Serial: serialNumber,
      }
        
      var js = JSON.stringify(obj);
      console.log(obj);
  
      try
      {
        const response = await fetch('https://cop-4331-16.herokuapp.com/api/verifySN',
          {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
  
        var res = JSON.parse(await response.text());
        console.log(res);

        if (res.error != 0)
        {
          setMessage(res.error);
        }
        else
        {
          actualAdd();
        }
      }
      catch(e)
      {
        console.log("error : " + e);
      }
    };

    const actualAdd = async () =>
    {
        var obj = 
        {
            userId: global.userId,
            Name: itemName,
            Brand: brand,
            Model: model, 
            Category: category,
            Location: location,
            Replacement: replacementValue,
            Serial: serialNumber,
            jwtToken: global.jwtToken
        }
        
        var js = JSON.stringify(obj);
        console.log(obj);
    
        try
        {
          const response = await fetch('https://cop-4331-16.herokuapp.com/api/addItem',
            {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
    
          var res = JSON.parse(await response.text());

          if (res.error != 0)
          {
            setMessage("An error occured, please try again later.");
          }
          else
          {
            global.jwtToken = res.jwtToken;
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
              navigation.push('DashboardScreen');
          }
      }
      catch(e)
      {
          console.log("error : " + e);
      }
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
              Item Details.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.placeHolder} 
              placeholder="Item Name"
              placeholderTextColor='silver'
              onChangeText={(val) => setItemName(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Brand"
              placeholderTextColor='silver'
              onChangeText={(val) => setBrand(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Model"
              placeholderTextColor='silver'
              onChangeText={(val) => setModel(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Category"
              placeholderTextColor='silver'
              onChangeText={(val) => setCategory(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Location"
              placeholderTextColor='silver'
              onChangeText={(val) => setLocation(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Replacement Value"
              placeholderTextColor='silver'
              keyboardType='number-pad'
              onChangeText={(val) => setReplacementValue(val)}
            />
            <TextInput style={styles.placeHolder} 
              placeholder="Serial Number"
              placeholderTextColor='silver'
              keyboardType='number-pad'
              onChangeText={(val) => setSerialNumber(val)}
            />
            <TouchableOpacity onPress={handleAdd}>
              <View style={styles.buttomButton}>
                <View style={styles.addButton}>
                  <Text style={styles.addText}>Add Item</Text>
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
        paddingLeft: 25,
        paddingTop: 20
      },
      backContainer: {
        paddingLeft: 25,
        paddingTop: 30
      },
      inputContainer:{
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
      },
      placeHolder: {
        height: 45, 
        width: 317, 
        borderColor: 'silver', 
        borderRadius: 7, 
        borderWidth: 1,  
        backgroundColor: 'transparent',
        marginBottom: 30, color: 'silver',
        paddingLeft: 20
      },
      addButton: {
        height: 45,
        width: 317,
        borderRadius: 7,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      },
      addText: { 
        color: 'black',
        //fontWeight: 'bold',
        fontSize: 17,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
      },
      buttomButton: {
        paddingTop: 10
      },
      text: { 
        color: 'silver',
        fontSize: 14,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
        paddingTop: 7
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
});

export default AddItemScreen;

  