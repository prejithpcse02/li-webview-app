import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const Search = ({
  onSearch,
  onSearchConfirm,
  placeholder,
}: {
  onSearch: (text: string) => void;
  onSearchConfirm: (text: string) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onSearch(text);
  };

  const handleSearchConfirm = () => {
    onSearchConfirm(inputValue);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        onSubmitEditing={handleSearchConfirm} // Trigger on enter key press
      />
      <Button title="Search" onPress={handleSearchConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default Search;
