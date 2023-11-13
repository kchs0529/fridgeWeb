import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Alert } from 'react-native';


export default function App() {
  const uri = "http://192.168.55.179";//이 부분을 자신의 ip로 변경해야 함
  // 앱이 시작될 때 유통기한을 확인하는 함수
  const checkExpirationDates = async () => {
    try {
      const response = await fetch(uri+':3000/getAllData');
      const products = await response.json();

      const today = new Date();
      today.setDate(today.getDate());

      // 내일 계산
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 2);
      
      
      let isProductExpiring = false;   
       
      console.log("오늘"+today); 
      console.log("내일"+tomorrow); 

      for (const product of products) {
        const expirationDate = new Date(product.expirationDate);
        if (expirationDate >= today && expirationDate <= tomorrow) {
          console.log("오늘"+today); 
          console.log("내일"+tomorrow);  
          console.log(expirationDate); 
          isProductExpiring = true; 
          break;
        }
      }
  
      if (isProductExpiring) {
        const expiringProducts = products
          .filter((product) => {
            const expirationDate = new Date(product.expirationDate);
            return expirationDate >= today && expirationDate <= tomorrow;
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
        mixedContentMode="always" 
        javaScriptEnabled={true} 
        domStorageEnabled={true} 
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

