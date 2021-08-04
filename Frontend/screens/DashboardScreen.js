import React, { useState } from 'react';
import { Text, View, StyleSheet,
         ImageBackground, ScrollView, FlatList,
         TouchableOpacity, TextInput, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

global.results = [];

const DashboardScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(global.fullList.length);

  const qrScanner = () => {
    navigation.push('ScanQrScreen');
  };

  const profile = () => {
    navigation.push('ProfileScreen');
  };

  const itemHandler = (item) =>
  {
    navigation.push('ItemInfoScreen', {item : item});
  };

  const Item = ({ item }) => (
    <TouchableOpacity onPress={() => itemHandler(item)}>
      <Text style={styles.item}>{item.Name + 
                                  "                                                            " + item.Location}</Text>
      <Text style={styles.serial}>{"S/N: " + item.Serial}</Text>
    </TouchableOpacity>
  ); 

  const handleSearch = async () => 
  {
    var obj =
    {
      userId: global.userId,
      search: search,
      jwtToken: global.jwtToken
    }

    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch('https://cop-4331-16.herokuapp.com/api/searchassets',
        {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      console.log(res);

      if (res.error != 0)
      {
        setMessage("An error occured, please try again.");
      }
      else
      {
        const item = res.results;
        console.log("Successful search");
        navigation.push('SearchResultScreen', {item : item});
      }
    }
    catch(e)
    {
      console.log("error : " + e);
    }
  }

  return (
    <ImageBackground source={require('../img/MainBackground.jpg')}
                       style={styles.background}>
      <View style={styles.container}>
        <View style={styles.firstRow}>
          <Text style={styles.title}>
            My Assets. 
          </Text>
          <TouchableOpacity onPress={profile}>
            <View style={styles.barsIcon}>
              <Text style={styles.barsText}>
                <Icon name='user-circle' size={50}/>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.secondContainer}>
            <TextInput style={styles.placeHolder} 
              placeholder="Search"
              placeholderTextColor='silver'
              onChangeText={(val) => setSearch(val)}
            />
            <TouchableOpacity onPress={handleSearch} 
              hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}>
              <View style={styles.searchIcon}>
                <Text style={styles.searchText}>
                  <Icon name='search' size={30}/>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.totalContainer}>
          <View style={styles.firstContainer}>
            <View style={styles.totalAssets}>
              <Text style={styles.totalAssetsTitle}>
                Total Assets
              </Text>
              <Text style={styles.assetsNumber}>
                {total}          
              </Text>
            </View>
            <View style={styles.qrContainer}>
              <TouchableOpacity onPress={qrScanner}>
                <View style={styles.qrcode}>
                  <Image source={{uri: 
                    'https://cdn.discordapp.com/attachments/856971368172355604/868360045971263548/162710333785752047.png'}} 
                    style={{width: 100, height: 100}} 
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.assetContainer}>
              <FlatList
                data={global.fullList}
                renderItem={Item}
                keyExtractor={item => item._id}    
              />
            </View>
          </View>
        </View>
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
  container: {
    paddingBottom: 10,
    paddingRight: 10,
    paddingTop: 75,
    paddingLeft: 10
  },
  title: {
    height: 45,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 5
  },
  searchContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingRight: 10
  },
  placeHolder: {
    height: 45, 
    width: 300, 
    borderColor: 'silver', 
    borderRadius: 7, 
    borderWidth: 1, 
    backgroundColor: 'transparent',
    //marginBottom: 20, 
    opacity: 100,
    color: 'silver',
    paddingLeft: 20
  },
  backContainer: {
    paddingLeft: 25,
    paddingTop: 30
  },
  searchText: { 
    color: 'white',
  },
  secondContainer: 
  {
    flexDirection: 'row'
  },
  searchIcon: 
  {
    paddingLeft: 20,
    paddingTop: 10
  },
  barsIcon: 
  {
    paddingLeft: 120,
  },
  barsText: {
    color: 'white'
  },
  qrcode: {
    paddingRight: 0,
    paddingTop: 0
  },
  qrcodeText: {
    color: 'white',
  },
  firstRow: {
    flexDirection: 'row'
  },
  totalAssets: {
    //paddingBottom: 50,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    height: 100,
    width: 180,
  },
  qrContainer: {
    //paddingBottom: 50,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    height: 100,
    width: 180,
    paddingLeft: 30,
    paddingBottom: 0,
  },
  totalAssetsTitle: {
    color: 'silver',
    fontSize: 18,
    //paddingLeft: 33,
    paddingTop: 10,
    paddingLeft: 25,
    alignSelf: 'center',
    //fontWeight: 'bold'
  },
  totalContainer: {
    paddingTop: 60,
    paddingLeft: 5
  },
  firstContainer: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  assetsNumber: {
    color: 'white',
    fontSize: 50,
    //paddingLeft: 120,
    alignSelf: 'center',
    paddingLeft: 25
  },
  assetContainer: {
    //paddingBottom: 50,
    backgroundColor:  'rgba(28, 28, 28, 0.7)',
    borderRadius: 7,
    height: 420,
    width: 360,
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
  tableContainer: {
    paddingTop: 20,
    paddingBottom: 50
  }
});

export default DashboardScreen;
