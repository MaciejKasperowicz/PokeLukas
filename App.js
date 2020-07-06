import React, { useEffect, useState, useCallback } from 'react';
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

import { fetchPokemonsList } from './apiService';
import { useDebounce } from './hooks/useDebounce';
import { useAsyncStorage } from './hooks/useAsyncStorage';
import { ListHeader } from './components/ListHeader';
import { ListItem } from './components/ListItem';

const App = () => {
  const [data, setData] = useState([]);
  const [source, setSource] = useAsyncStorage('@pokeDexList');

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {

    (async () => {
      console.log('useEffect1');
      const list = await AsyncStorage.getItem('@pokeDexList');

      if (list == null) {
        const response = await fetchPokemonsList();
        setSource(response.results);
      }
      setData(source);

    })();
    //esling-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPokemonsList = async () => {
    setIsRefreshing(true);
    const response = await fetchPokemonsList();
    setSource(response.results);
    setData(response.results);
    setIsRefreshing(false);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterPokemons = useCallback(
    term =>
      source.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()),
      ),
    [source],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredPokemons = filterPokemons(debouncedSearchTerm);
      setData(filteredPokemons);
    } else {
      setData(source);
    }
  }, [debouncedSearchTerm, source, filterPokemons]);

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        <FlatList
          onRefresh={refreshPokemonsList}
          refreshing={isRefreshing}
          ListHeaderComponent={<ListHeader onChange={setSearchTerm} />}
          data={data}
          scrollEnabled={!isRefreshing}
          keyExtractor={(item, index) => item.name + index}
          windowSize={5}
          renderItem={({ item, index }) => {
            return (
              <ListItem item={item} index={index} isRefreshing={isRefreshing} />
              // <TouchableOpacity
              //   onPress={() => Alert.alert(item.name, item.url)}
              //   key={index}
              //   style={[
              //     styles.itemContainer,
              //     isRefreshing && styles.disableItemContainer,
              //   ]}>
              //   <Text style={styles.text}>{item.name}</Text>
              // </TouchableOpacity>
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
  disableItemContainer: {
    backgroundColor: '#eee',
  },
});

export default App;