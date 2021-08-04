import React, {useState} from 'react';
import { View, Text, StyleSheet, Alert,
         ImageBackground, TouchableOpacity,
         } from 'react-native';
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import Icon, { Button } from 'react-native-vector-icons/FontAwesome';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';

import BackButton from '../components/BackButton';
import Colors from '../components/Colors';

const ItemInfoScreen = ({ route, navigation }) => {
    const item = route.params.item;
    const [confirm, setConfirm] = useState('false');
    const [message, setMessage] = useState('');

    const back = () => {
        navigation.pop();
    };

    const edit = () => {
        navigation.push('EditScreen', {item : item});
    };

    const alertDelete = () => 
    {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this item?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => deleteItem(),
              },
            ],
            {cancelable: false},
          );
    }

    const deleteItem = async () => 
    {
        var obj =
        {
            itemId: item.itemId,
            jwtToken: global.jwtToken
        }

        var js = JSON.stringify(obj);
        console.log(global.fullList.length + "Before");

        try
        {
            const response = await fetch('https://cop-4331-16.herokuapp.com/api/deleteitem',
                {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            console.log(res);

            if (res.error != 0)
            {
                setMessage("An error occured, please try again.");
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
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={back}>
                <View style={styles.backContainer}>
                <BackButton></BackButton>
                </View>
            </TouchableOpacity>
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>
              {item.Name}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.column1}>
                <Text style={styles.nameText}>Brand</Text>
                <Text style={styles.nameText}>Model</Text>
                <Text style={styles.nameText}>Category</Text>
                <Text style={styles.nameText}>Location</Text>
                <Text style={styles.nameText}>Replacement Value</Text>
                <Text style={styles.nameText}>Serial Number</Text>
            </View>
            <View style={styles.column2}>     
                <Text style={styles.assetInfoText}>{item.Brand}</Text> 
                <Text style={styles.assetInfoText}>{item.Model}</Text>     
                <Text style={styles.assetInfoText}>{item.Category}</Text>
                <Text style={styles.assetInfoText}>{item.Location}</Text>     
                <Text style={styles.assetInfoText}>${item.Replacement}</Text>
                <Text style={styles.assetInfoText}>{item.Serial}</Text>       
            </View>
          </View>
          <View style={styles.pad}>
            <View style={styles.buttonHandler}>
                <View style={styles.editButton}>
                    <TouchableOpacity onPress={edit}>
                        <Text style={styles.editText}>Edit Asset</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.deleteButton}>
                    <TouchableOpacity onPress={alertDelete}>
                        <Text style={styles.deleteText}>Delete Asset</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.text}>{message}</Text>
          </View>
        </ImageBackground>
      );
};

const styles = StyleSheet.create({
    backText: { 
        color: 'white',
    },
    background: {
        flex: 1,
        paddingTop: 20
    },
    backContainer: {
        paddingLeft: 30,
        paddingTop: 35
    },
    title: {
        paddingLeft: 30,
        paddingTop: 30
    },
    titleText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold'
    },
    assetInfoText: {
        color: 'white',
        fontSize: 18,
        paddingTop: 35,
        paddingLeft: 10,
        alignSelf: 'center',
        //fontWeight: 'bold',
    },
    nameText:{
        color: 'white',
        fontSize: 18,
        paddingTop: 35,
        paddingLeft: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    table: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingTop: 50
    },
    column1: {
        backgroundColor: 'rgba(28, 28, 28, 0.7)',
        width: 165,
        height: 380,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7
    },
    column2: {
        backgroundColor: 'rgba(28, 28, 28, 0.7)', //'rgba(192, 192, 192, 0.7)',
        width: 165,
        height: 380,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7
    },
    buttonHandler: {
        flexDirection: 'row',
        width: 317,
        height: 48,
        justifyContent: 'center',
        alignSelf: 'center',
      },
      deleteButton: {
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: Colors.grey,
        height: 48,
        width: 165,
      },
      deleteText: { 
        color: 'white',
        fontSize: 17,
        alignSelf: 'center', 
      },
      editButton: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: 'silver',
        height: 48,
        width: 165,
      },
      editText: { 
        color: 'black',
        fontSize: 17,
        //flexDirection: 'row',
        alignSelf: 'center',
      },
      pad: {
          paddingBottom: 90
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
});

export default ItemInfoScreen;

  