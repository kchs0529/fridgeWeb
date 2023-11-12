import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Alert } from 'react-native';


export default function App() {
  const uri = "http://192.168.55.179";
  // 앱이 시작될 때 유통기한을 확인하는 함수
  const checkExpirationDates = async () => {
    try {
      const response = await fetch(uri+':3000/getAllData');
      const products = await response.json();

      const today = new Date();
      today.setDate(today.getDate()-1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      let isProductExpiring = false;
  
      for (const product of products) {
        const expirationDate = new Date(product.expirationDate);
        if (expirationDate > today && expirationDate <= tomorrow) {
          isProductExpiring = true;
          break;
        }
      }
  
      if (isProductExpiring) {
        const expiringProducts = products
          .filter((product) => {
            const expirationDate = new Date(product.expirationDate);
            return expirationDate > today && expirationDate <= tomorrow;
          })
          .map((product) => product.productName);
      
        let alertMessage = '';
        if (expiringProducts.length <= 3) {
          // 제품명이 3개 이하인 경우 모두 포함
          alertMessage = `다음 제품들의 유통기한이 임박했습니다: ${expiringProducts.join(', ')}`;
        } else {
          // 제품명이 3개 이상인 경우 첫 3개만 포함하고 나머지는 생략
          const firstThreeProducts = expiringProducts.slice(0, 3);
          alertMessage = `다음 제품들의 유통기한이 임박했습니다: ${firstThreeProducts.join(', ')} 외 ${expiringProducts.length - 3}개`;
        }
      
        Alert.alert(
          '유통 기한 임박',
          alertMessage,
          [
            { text: '확인', onPress: () => console.log('Alert closed') }
          ]
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 앱이 로드될 때 함수 호출
  useEffect(() => {
    checkExpirationDates();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: uri+':3001' }}
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

