import React, {useEffect, useState} from 'react';
import {Button, Dimensions, StyleSheet, 
        ImageBackground, TouchableOpacity, 
        Text, View} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import AddItemScreen from './AddItemScreen';

global.SN = '';
const finderWidth = 280;
const finderHeight = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

const ScanQrScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
    const [scanned, setScanned] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    const handleBarCodeScanned = (scanningResult) => 
    {
        if (!scanned) 
        {
            const {type, data, bounds: {origin} = {}} = scanningResult;
            const {x, y} = origin;

            if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                setScanned(true);
                global.SN = data;
                setMessage("S/N: " + data);
            }
        }
    };

    const handleAdd = async () =>
    {
      var obj = 
      {
        Serial: global.SN,
      }
        
      var js = JSON.stringify(obj);
      console.log(obj);
  
      try
      {
        const response = await fetch('https://cop-4331-16.herokuapp.com/api/verifySN',
          {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
  
        var res = JSON.parse(await response.text());

        if (res.error != 0)
        {
          setMessage(res.error);
        }
        else
        {
          navigation.push('AddItemQrScreen');
        }
      }
      catch(e)
      {
        console.log("error : " + e);
      }
    };

    const checkScan = () =>
    {
        if (!scanned)
        {
            setMessage("Nothing has be scanned yet");
        }
        else
        {
            handleAdd();
        }
    }

    if (hasPermission === null) 
    {
        return <Text style={styles.requestText}>Requesting for camera permission</Text>;
    }

    if (hasPermission === false) 
    {
        return <Text tyle={styles.requestText}>No access to camera</Text>;
    }

    return (
        <ImageBackground source={require('../img/MainBackground.jpg')}
                       style={styles.background}>
            <View style={{flex: 1}}>
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                type={type}
                                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                style={[StyleSheet.absoluteFillObject, styles.container]}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}
                        >
                            {scanned && 
                            <TouchableOpacity onPress={() => setScanned(false)}>
                                <View style={styles.scanButton}>
                                    <View style={styles.scanAgainbutton}>
                                        <Text style={styles.scanText}>Scan Again</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'flex-end',
                            }}
                            onPress={checkScan}
                            >
                            <View style={styles.cameraButton}>
                                <View style={styles.scanAgainbutton}>
                                    <Text style={styles.scanText}> 
                                        Continue 
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>   
                    </View> 
                    <Text style={styles.text}>{message}</Text>
                    <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>
                </BarCodeScanner>
            </View>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
      },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    requestText: {
        color: 'black',
        fontSize: 16
    },
    swap: {
        fontSize: 20, 
        margin: 5, 
        color: 'white',
        paddingTop: 20,
        paddingRight: 35
    },
    scanAgainbutton: {
        height: 45,
        width: 150,
        borderRadius: 7,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      },
      scanText: { 
        color: 'black',
        //fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
        fontWeight: 'bold'
      },
      scanButton: {
        paddingTop: 650,
        paddingLeft: 35
      },
      cameraButton: {
        paddingTop: 650,
        paddingRight: 35
      },
      text: { 
        color: 'white',
        fontSize: 14,
        //SflexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
        paddingBottom: 30,
        fontSize: 20,
        fontWeight: 'bold'
      },
});

export default ScanQrScreen;