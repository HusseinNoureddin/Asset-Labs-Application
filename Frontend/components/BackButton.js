import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BackButton = () => {
    return (
    <Text style={styles.backText}>
        <Icon name='angle-left' size={50}/>
    </Text>
    );
};

const styles = StyleSheet.create({
    backText: { 
        color: 'white',
    }
});

export default BackButton;

  