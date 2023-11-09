import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.55.179:3001' }}
        // Mixed content(보안되지 않은 HTTP 요소)를 항상 허용합니다.
        mixedContentMode="always" 
        // JavaScript 실행을 허용합니다.
        javaScriptEnabled={true} 
        // DOM 저장소를 활성화합니다.
        domStorageEnabled={true} 
        // 모든 원본을 허용하는 원본 허용 목록을 설정합니다.
        originWhitelist={['http://localhost:3000', 'http://192.168.55.179:3001']} 
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

