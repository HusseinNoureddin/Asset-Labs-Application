import React, { useState } from 'react';
import { Text, View, StyleSheet,
         Button, ImageBackground,
        TouchableOpacity} from 'react-native';

import Colors from '../components/Colors';

const MainScreen = ({ navigation }) => {
  const loginPress = () => {
    navigation.push('LoginScreen');
  };

  const registerPress = () => {
    navigation.push('RegisterScreen');
  };

  return (
    <ImageBackground source={require('../img/MainBackground.jpg')}
                       style={styles.background}>
        <Text style={styles.title}>
          asset labs.
        </Text>
        <View style={styles.buttonHandler}>
          <TouchableOpacity onPress={registerPress}>
            <View style={styles.registerButton}>
              <Text style={styles.registerText}>Register</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={loginPress}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Sign In</Text>
            </View>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
  buttonHandler: {
    flexDirection: 'row',
    width: 317,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    padding: 85,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white'
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: Colors.grey,
    height: 48,
    width: 159
  },
  loginText: { 
    color: 'white',
    fontSize: 16,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  registerButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height: 48,
    width: 159
  },
  registerText: { 
    color: 'black',
    fontSize: 16,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  }
});

export default MainScreen;
