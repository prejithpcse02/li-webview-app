import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

// ...
const test = () => {
  return (
    <WebView source={{ uri: "https://www.google.com" }} style={{ flex: 1 }} />
  );
};

export default test;
