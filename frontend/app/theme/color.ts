const palette = {
  black: "#1d1d1d",
  white: "#ffffff",
  purple: "#7B68EE",
  lilac: "#EAEAFF",
  red: "#FF0000",
}

/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The screen background.
   */
  background: palette.white,
  /**
   * The main tinting color.
   */
  primary: palette.purple,
  /**
   * A subtle color used for borders and lines.
   */
  border: palette.purple,
  /**
   * The default color of text in many components.
   */
  text: palette.purple,
  /**
   * Button background
   */
  button: palette.purple,
  /**
   * Text in buttons
   */
  textButton: palette.white,
  /**
   * Error messages and icons.
   */
  error: palette.red,
  /**
   * Input bar and bottom tab bar navigator color.
   */
  bar: palette.lilac,

  /**
   * Storybook background for Text stories, or any stories where
   * the text color is color.text, which is white by default, and does not show
   * in Stories against the default white background
   */
  storybookDarkBg: palette.black,

  /**
   * Storybook text color for stories that display Text components against the
   * white background
   */
  storybookTextColor: palette.black,
}
