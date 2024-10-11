import { StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';

export default function ModuleScreen() {
  return (
    <SafeAreaView  style={styles.container}>
    <ScrollView style={{padding: 20}}>
      <Text>
        This screen will display a video of the module
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