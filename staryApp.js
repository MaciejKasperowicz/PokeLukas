import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    // ScrollView,
    // View,
    Text,
    StatusBar,
    Platform,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { fetchPokemonsList } from './apiService';
// import { useAsyncStorage } from './hooks/useAsyncStorage';
import { ListHeader } from './components/ListHeader';
import { useDebounce } from './hooks/useDebounce';
const pokeDexListKey = '@pokedex_List';

const App = () => {

    const [data, setData] = useState([]);
    // const [storedData, storeData] = useAsyncStorage(pokeDexListKey);
    const [term, setTerm] = useState('');
    const [source, setSource] = useState([]);

    const storeData = async value => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(pokeDexListKey, jsonValue);
        } catch (e) {
            console.error('Store error', e);
        }
    };

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(pokeDexListKey);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Read error', e);
        }
    };

    useEffect(() => {
        (async () => {
            const pokeList = await getData();

            // console.log("pokeList", pokeList);
            if (pokeList == null) {
                const response = await fetchPokemonsList();
                setData(response.results);
                setSource(response.results);
                await storeData(response.results);

            } else {
                setData(pokeList);
                setSource(pokeList);
            }
        })();
    }, []);

    // useEffect(() => {
    //   (async () => {
    //     const pokeList = await AsyncStorage.getItem(pokeDexListKey);
    //     if (pokeList == null) {
    //       const response = await fetchPokemonsList();
    //       await storeData(response.results);

    //       setSource(response.results);

    //     }
    //     setData(storedData);
    //     setSource(pokeList);

    //   })();
    // }, [storedData]);

    const debounceSearchTerm = useDebounce(term, 500);
    const filterList = term =>
        source.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));

    useEffect(() => {
        if (debounceSearchTerm) {
            const filteredList = filterList(debounceSearchTerm);
            setData(filteredList);
        } else {
            setData(source);
        }
    }, [debounceSearchTerm]);


    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content';

    return (
        <React.Fragment>
            <StatusBar barStyle={barStyle} backgroundColor="black" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    ListHeaderComponent={
                        <ListHeader onChangeText={text => setTerm(text)} />
                    }
                    data={data}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={styles.button}
                                key={item.name}
                                onPress={() => Alert.alert(item.name)}>
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </SafeAreaView>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    textContainer: {
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: '400',
    },
    button: {
        padding: 4,
    },
});

export default App;
