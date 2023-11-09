import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.55.179:3001' }}
        mixedContentMode="always" 
        javaScriptEnabled={true} 
        domStorageEnabled={true} 
        originWhitelist={['*']} 
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

