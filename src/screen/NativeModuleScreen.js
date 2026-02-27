import { useState } from 'react';
import { Button, FlatList, NativeModules, Platform, StyleSheet, Text, View } from 'react-native';

// This links to the MovieModule you will create in Android/iOS folders
const { MovieModule } = NativeModules;

const NativeModuleScreen = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      // TASK: Module should return an array of movies (Promise or callback)
      const data = await MovieModule.getMovies();
      setMovies(data);
    } catch (error) {
      console.log("Bridge Error: Module not linked yet. This is expected until you do 'npx expo prebuild'.", error);
      // Fallback static data for testing UI before bridging
      setMovies([{ id: 1, title: 'Static Movie 1' }, { id: 2, title: 'Static Movie 2' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Module Exam</Text>
      <Button title="Get Movies from Native Bridge" onPress={fetchMovies} />
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' , paddingTop: Platform.OS === 'ios' ? 0 : 0, },
  
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  movieItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  movieTitle: { fontSize: 16 }
});

export default NativeModuleScreen;