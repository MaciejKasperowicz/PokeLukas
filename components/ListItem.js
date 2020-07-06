import React, { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '../apiService';
import { Text, View, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import 'abortcontroller-polyfill';
const AbortController = window.AbortController;

export const ListItem = ({ item, index, isRefreshing }) => {
    const [details, setDetails] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        (async () => {


            const response = await fetchPokemonDetails(item.url, signal);
            setDetails(response);

        })();
        return () => controller.abort();
    }, [item.url]);

    const rednerDetails = () => {
        // console.log(details);
        if (details.length == 0) {
            return <ActivityIndicator size="small" />
        }
        return (
            <>
                <Image style={styles.imageSize} source={{ uri: details.sprites.front_default }} />
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{details.id}</Text>
            </>
        )
    }
    return (
        <View>
            <TouchableOpacity
                onPress={() => Alert.alert(item.name, item.url)}
                key={index}
                style={[
                    styles.itemContainer,
                    isRefreshing && styles.disableItemContainer,
                ]}>
                {rednerDetails()}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    container: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: '100',
    },
    itemContainer: {
        padding: 8,
    },
    disableItemContainer: {
        backgroundColor: '#eee',
    },
    imageSize: {
        width: 50,
        height: 50
    }
});


{/* <TouchableOpacity
    onPress={() => Alert.alert(item.name, item.url)}
    key={index}
    style={[
        styles.itemContainer,
        isRefreshing && styles.disableItemContainer,
    ]}>
    <Text style={styles.text}>{item.name}</Text>
</TouchableOpacity> */}