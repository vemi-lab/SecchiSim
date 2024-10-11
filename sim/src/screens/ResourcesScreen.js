import { StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';

export default function SecchiSimScreen() {
  return (
    <SafeAreaView  style={styles.container}>
    <ScrollView style={{padding: 20}}>
      <Text>
        This screen will display the available Resources
      </Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //padding: 20,
  },
});