import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ViewDocument = ({ route, navigation }) => {
  const { documentUrl } = route.params; // Receive the document URL passed via navigation parameters

  return (
    <View style={styles.container}>
      <WebView source={{ uri: documentUrl }} style={styles.webView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default ViewDocument;
