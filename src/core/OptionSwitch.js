import React from "react";
import { StyleSheet, Switch, View, Text } from "react-native";

const OptionSwitch = ({ value, onChange, label }) => {
  return (
    <View style={styles.switchContainer}>
      <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} value={value} onValueChange={onChange} accessibilityLabel={label} />
      <Text style={styles.switchLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 5,
  },
  switchLabel: {
    color: "#333",
    marginLeft: 5,
  },
});

export default OptionSwitch;
