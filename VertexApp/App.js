import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={{ flex: 1 }}>
        <WebView 
          source={{ uri: 'https://vertextradspro.vercel.app/' }} 
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  }
});
