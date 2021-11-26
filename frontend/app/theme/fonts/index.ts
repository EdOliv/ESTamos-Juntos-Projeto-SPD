import * as Font from "expo-font"

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
  await Font.loadAsync({
    ComfortaaBold: require("./Comfortaa-Bold.ttf"),
    "Comfortaa-Bold": require("./Comfortaa-Bold.ttf"),

    RobotoRegular: require("./Roboto-Regular.ttf"),
    "Roboto-Regular": require("./Roboto-Regular.ttf"),

  })
}
