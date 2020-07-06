import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    StatusBar,
    Platform,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { ListHeader } from './components/ListHeader';
import { fetchPokemonsList } from './apiService';
import { useAsyncStorage } from './hooks/useAsyncStorage';

const LIST = '@pokedex_List';

const App = () => {
    const [data, setData] = useState([]);
    const [storedData, storeData] = useAsyncStorage(LIST);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            const pokeList = await AsyncStorage.getItem(LIST);

            if (pokeList == null) {
                const response = await fetchPokemonsList();
                await storeData(response.results);
                console.log('api request');
            }
            setData(storedData);

            // console.log(pokeList);
        })();
    }, [storedData]);

    const filterPokemonsList = term => {
        if (term) {
            const result = storedData.filter(item =>
                item.name.toLowerCase().includes(term.toLowerCase()),
            );
            console.log(result);
            setData(result);
        } else {
            setData(storedData);
        }

    };

    const refreshPokemonList = async () => {
        setIsRefreshing(true);
        const response = await fetchPokemonsList();
        await storeData(response.results);
        setData(response.results)
        setIsRefreshing(false);
    }

    const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

    return (
        <>
            <StatusBar barStyle={barStyle} backgroundColor="black" />
            <SafeAreaView style={styles.appContainer}>
                <FlatList
                    onRefresh={refreshPokemonList}
                    refreshing={isRefreshing}
                    ListHeaderComponent={<ListHeader onChangeText={filterPokemonsList} />}
                    data={data}
                    keyExtractor={(item, index) => item.name + index}
                    scrollEnabled={!isRefreshing}
                    renderItem={({ item, index, separator }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => Alert.alert(item.name, item.url)}
                                key={index}
                                style={[styles.itemContainer, isRefreshing && styles.disabledItem]}>
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </SafeAreaView>
        </>
    );
};

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
    disabledItem: {
        backgroundColor: "grey"
    }
});

export default App;