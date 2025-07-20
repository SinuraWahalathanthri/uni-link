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
   emailInputWrapperWhite: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    borderColor:"#EDEDED",
    borderWidth:1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
   btnWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    borderColor:"#EDEDED",
    borderWidth:1,
    alignItems: "center",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Lato",
    flex: 1,
  },
  focusedInput: {
    borderColor: "#505050",
    borderWidth: 1,
  },
});

export default CommonStyles;
