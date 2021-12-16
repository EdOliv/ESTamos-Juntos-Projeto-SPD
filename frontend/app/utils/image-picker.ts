import * as ImagePicker from "expo-image-picker"

export const openImagePickerAsync = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (permissionResult.granted === false) {
    alert("Permission to access camera roll is required!")
    return null;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    base64: true,
  })
  return pickerResult;
}