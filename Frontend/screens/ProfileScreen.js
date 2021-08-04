import React, {useState} from 'react';
import { View, Text, ImageBackground, 
         TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import BackButton from '../components/BackButton';

const ProfileScreen = ({navigation}) => {
    const back = () => {
      navigation.pop();
    };

    const addPage = () => {
      navigation.push('AddItemScreen');
    };

    const home = () => {
        navigation.push('DashboardScreen');
    };

    const logout = () => {
        global.firstName = '';
        global.lastName = '';
        global.userId = -1;
        global.jwtToken = '';
        global.companyName = companyName;
        global.username = '';
        global.email = '';
        global.phone = '';
        global.SN = '';
        global.fullList = [];
        global.results = [];
        navigation.push('MainScreen');
    };
    
    return (
        <ImageBackground source={require('../img/MainBackground.jpg')}
                          style={styles.background}>
          <TouchableOpacity onPress={back}>
            <View style={styles.backContainer}>
              <BackButton></BackButton>
            </View>
          </TouchableOpacity>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>
              <Icon name='user-circle' size={80}/>
            </Text>
          </View>
          <View style={styles.hey}>
            <Text style={styles.heyText}>
              Hey
            </Text>
          </View>
          <View style={styles.naming}>
            <Text style={styles.nameText}>
              {global.firstName + " " + global.lastName}
            </Text>
          </View>
          <TouchableOpacity onPress={home}>
            <View style={styles.home}>
                <Text style={styles.linkText}>
                    Dashboard
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={addPage}>
            <View style={styles.assets}>
                <Text style={styles.linkText}>
                    Manual Add
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <View style={styles.logout}>
                <Text style={styles.logoutText}>
                    Sign Out
                </Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      );
};

const styles = StyleSheet.create({
      background: {
        flex: 1,
      },
      backContainer: {
        paddingLeft: 25,
        paddingTop: 30
      },
      profileIcon: 
      {
        paddingLeft: 40,
        paddingTop: 30
      },
      profileText: {
        color: 'white'
      },
      hey: {
        paddingLeft: 40,
        paddingTop: 30
      },
      heyText: {
          color: 'white',
          fontSize: 26
      },
      naming: {
        paddingLeft: 40,
        paddingTop: 5
      },
      nameText: {
          color: 'white',
          fontSize: 26,
          fontWeight: 'bold'
      },
      home: {
        paddingLeft: 40,
        paddingTop: 150
      },
      assets: {
        paddingLeft: 40,
        paddingTop: 25
      },
      linkText: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'normal'
      },
      logout: {
        paddingLeft: 40,
        paddingTop: 185
      },
      logoutText: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'normal'
      },
});

export default ProfileScreen;

  