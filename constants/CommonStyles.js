import { StyleSheet } from "react-native";

const CommonStyles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    flex: 1,
  },
  focusedInput: {
    borderColor: "#505050",
    borderWidth: 1,
  },
});

export default CommonStyles;
