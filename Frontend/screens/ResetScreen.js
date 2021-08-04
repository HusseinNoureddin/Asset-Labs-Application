import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground,
         TouchableOpacity, TextInput} from 'react-native';

import BackButton from '../components/BackButton';
import Colors from '../components/Colors';
import md5 from '../components/md5';
        
const ResetScreen = ({navigation}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const back = () => {
    navigation.pop();
  };

  const passwordReset = async () => 
  {
    if (newPassword != confirmNewPassword)
    {
      setMessage("Passwords don't match");
    }
    else
    {
      setMessage("Just a moment please...");
      var hash = md5(newPassword);
      var obj = {Email: global.email, Password: hash};
      var js = JSON.stringify(obj);
      try
      {
        const response = await fetch('https://cop-4331-16.herokuapp.com/api/reset',
          {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

        navigation.push('LoginScreen');
        console.log("Password successfully resetted");
      }
      catch(e)
      {
        console.log("error : " + e);
      }
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
          Reset your password.
        </Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          Try not to forget it this time
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.placeHolder} 
          placeholder="New Password"
          placeholderTextColor='silver'
          secureTextEntry={true}
          onChangeText={(val) => setNewPassword(val)}
        />
        <TextInput style={styles.placeHolder} 
          placeholder="Confirm New Password"
          placeholderTextColor='silver'
          secureTextEntry={true}
          onChangeText={(val) => setConfirmNewPassword(val)}
        />
        <Text style={styles.text}>{message}</Text>
        <TouchableOpacity onPress={passwordReset}>
          <View style={styles.loginButton}>
            <View style={styles.login}>
              <Text style={styles.loginText}>
                Reset
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
    paddingTop: 85,
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
  login: {
    height: 45,
    width: 317,
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  loginText: { 
    color: 'black',
    fontSize: 17,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  loginButton: {
    paddingTop: 330
  },
  text: { 
    color: 'silver',
    fontSize: 14,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    paddingTop: 0
  },
});

export default ResetScreen;
