import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground, Alert,
         TouchableOpacity, TextInput,
         TouchableWithoutFeedback, Keyboard} from 'react-native';
import jwt_decode from "jwt-decode";

import BackButton from '../components/BackButton';
import Colors from '../components/Colors';
import md5 from '../components/md5';

global.userId = -1;
global.firstName = '';
global.lastName = '';
global.jwtToken = '';
global.fullList = [];

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const back = () => {
    navigation.pop();
  };

  const forgotPass = () => {
    navigation.push('ForgotPasswordScreen');
  };

  const registerPress = () => {
    navigation.push('RegisterScreen');
  };

  const handleLogin = async () =>
  {
    var hash = md5(password);

    try
    {
      var obj = {login: username, password: hash};
      var js = JSON.stringify(obj);

      const response = await fetch('https://cop-4331-16.herokuapp.com/api/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      const token = jwt_decode(res.token.accessToken, { complete: true });
      global.fullList = res.arr;
      console.log(global.fullList);

      if (token.userId != "")
      {
        global.firstName = token.firstName;
        global.lastName = token.lastName;
        global.userId = token.userId;
        global.jwtToken = res.token.accessToken;
        navigation.push('DashboardScreen');
      }
    }
    catch(e)
    {
      console.log("error : " + e);
      setMessage("Login/Password Combination Incorrect"); 
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
            Let's sign you in.
          </Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            Welcome back.{"\n"}
            You've been missed!
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.placeHolder} 
            placeholder="Username"
            placeholderTextColor='silver'
            onChangeText={(val) => setUsername(val)}
          />
          <TextInput style={styles.placeHolder} 
            placeholder="Password"
            placeholderTextColor='silver'
            secureTextEntry={true}
            onChangeText={(val) => setPassword(val)}
          />
          <Text style={styles.text2}>{message}</Text>
          <TouchableOpacity onPress={forgotPass}>
            <View style={styles.forgotPress}>
              <Text style={styles.text}>
                Forgot my password?
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={registerPress}>
            <View style={styles.newUser}>
              <Text style={styles.text}>
                Don't have an account? 
                <Text style={styles.registerText}>
                  {" "}Register
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.buttomButton}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>Sign In</Text>
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
    fontSize: 48,
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
    fontSize: 36,
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
    paddingTop: 60,
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
  loginButton: {
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
  buttomButton: {
    paddingTop: 15
  },
  text: { 
    color: 'silver',
    fontSize: 14,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  text2: { 
    color: 'silver',
    fontSize: 14,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    paddingTop: 0,
  },
  errorText: {
    color: 'white',
    fontSize: 12,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  forgotPress: {
    paddingTop: 240,
    paddingBottom: 4,
  },
  newUser: {
    paddingBottom: 2,
  },
  registerText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  }
});

export default LoginScreen;
