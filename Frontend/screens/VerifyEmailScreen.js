import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground,
         TouchableOpacity, TextInput} from 'react-native';

import BackButton from '../components/BackButton';
import Colors from '../components/Colors';

const VerifyEmailScreen = ({navigation}) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const back = () => {
    navigation.pop();
  };

  const verifyCodes = async () =>
  {
    if (code != global.generatedCode)
    {
      setMessage("Code Input Incorrect");
    }
    else
    {
      await register();
    }
  }

  const register = async () => 
  {
    var obj = 
    {
      FirstName: global.firstName,
      LastName: global.lastName,
      Email: global.email,
      Login: global.username,
      Password: global.password, 
      Phone: global.phone, 
      CompanyName: global.companyName
    };

    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch('https://cop-4331-16.herokuapp.com/api/register',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      // Testing Purposes
      console.log(JSON.stringify(res));
      console.log("Successfully Registered!");

      navigation.push('LoginScreen');
    }
    catch(e)
    {
      console.log("error : " + e);
    }
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
            Your almost there.
          </Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            Let's verify your email.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.placeHolder} 
            placeholder="Code"
            placeholderTextColor='silver'
            onChangeText={(val) => setCode(val)}
          />
          <Text style={styles.checkText}>
            {" "}Check your email for a code.
          </Text>
          <TouchableOpacity onPress={verifyCodes}>
            <View style={styles.verifyButton}>
              <View style={styles.verify}>
                <Text style={styles.verifyText}>
                  Verify Email
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingTop: 5
  },
  subtitleText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    color: 'white'
  },
  subtitleContainer: {
    paddingLeft: 25,
    paddingTop: 5
  },
  backContainer: {
    paddingLeft: 25,
    paddingTop: 30
  },
  inputContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  placeHolder: {
    height: 45, 
    width: 317, 
    borderColor: 'silver', 
    borderRadius: 7, 
    borderWidth: 1,  
    backgroundColor: 'transparent',
    marginBottom: 5, color: 'silver',
    paddingLeft: 20
  },
  verify: {
    height: 45,
    width: 317,
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  verifyText: { 
    color: 'black',
    fontSize: 17,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  verifyButton: {
    paddingTop: 380
  },
  checkText: { 
    color: 'silver',
    fontSize: 14,
    paddingRight: 150,
    paddingBottom: 45
  },
});

export default VerifyEmailScreen;
