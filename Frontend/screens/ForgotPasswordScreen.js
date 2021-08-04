import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground,
         TouchableOpacity, TextInput} from 'react-native';

import BackButton from '../components/BackButton';
import Colors from '../components/Colors';

global.email = '';
global.resCode = -1;

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageTwo, setMessageTwo] = useState('');

  const back = () => {
    navigation.pop();
  };

  const generateCode = async () =>
  {
    var obj = {email: email};
    global.email = email;
    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch('https://cop-4331-16.herokuapp.com/api/recover',
        {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      console.log(res);

      if (res.error != 0)
      {
        setMessage(res.error);
      }
      else
      {
        global.resCode = res.code;
        setMessage("Code sent");
      }
    }
    catch(e)
    {
      console.log("error : " + e);
    }
  }

  const verify = async () =>
  {
    if (receivedCode != global.resCode)
    {
      setMessageTwo("Inavlid code");
    }
    else
    {
      navigation.push('ResetScreen');
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
          Forgot password.
        </Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          Let's try to get you logged in
        </Text>
      </View>
      <View style={styles.subtitleTwoContainer}>
        <Text style={styles.subtitleTwoText}>
          Use the email you created your Asset Labs
          {"\n    "} account with to reset your password.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.placeHolder} 
          placeholder="Email Verification"
          placeholderTextColor='silver'
          onChangeText={(val) => setEmail(val)}
        />
        <TouchableOpacity onPress={generateCode}>
          <View style={styles.sendCode}>
            <View style={styles.sendButton}>
              <Text style={styles.sendText}>Send Code</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>{message}</Text>
      </View>
      <View style={styles.scdInputContainer}>
        <TextInput style={styles.scdplaceHolder} 
            placeholder="Code"
            placeholderTextColor='silver'
            onChangeText={(val) => setReceivedCode(val)}
        />
        <Text style={styles.checkText}>
            {"   "}Check your email for a code.
        </Text>
        <TouchableOpacity onPress={verify}>
          <View style={styles.verify}>
            <View style={styles.verifyButton}>
              <Text style={styles.verifyText}>
                Verify Email 
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>{messageTwo}</Text>
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
  subtitleTwoText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    color: 'white'
  },
  subtitleTwoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  },
  backContainer: {
    paddingLeft: 25,
    paddingTop: 30
  },
  inputContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
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
  scdInputContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 145,
  },
  scdplaceHolder: {
    height: 45, 
    width: 317, 
    borderColor: 'silver', 
    borderRadius: 7, 
    borderWidth: 1,  
    backgroundColor: 'transparent',
    marginBottom: 5, 
    color: 'silver',
    paddingLeft: 20
  },
  sendCode: {
    height: 45,
    width: 317,
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: Colors.grey,
  },
  sendText: { 
    color: 'white',
    fontSize: 17,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  checkText: { 
    color: 'silver',
    fontSize: 14,
    paddingRight: 150,
    paddingBottom: 35
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
    //paddingTop: 15
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

export default ForgotPasswordScreen;
