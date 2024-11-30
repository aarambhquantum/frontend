import { createTheme } from "@mui/material/styles";

const customTheme = () => {
  return createTheme({
    palette: {
      typography: {
        primary: "#1a1a1a",
        white: "#FFF"
      },
      background: {
        white: "#FFF"
      },
      border: {
        grayLight: "#F7F7F7",
        grayDark: "#EFEFEF",
      },
    },
    typography: {
      fontFamily: '"garamond", "sans-serif-pro", "Roboto", "Helvetica", "Arial", "sans-serif" ',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightSemiBold: 700,
      fontWeightBold: 800,
      h1: {
        fontSize: "2.5rem"
      },
      h2: {
        fontSize: "2rem"
      },
      h3: {
        fontSize: "1.75rem"
      },
      h4: {
        fontSize: "1.5rem"
      },
      subtitle1: {
        fontSize: "1.25rem"
      },
      body1: {
        fontSize: "1rem"
      },
      overline: {
        fontSize: "0.875rem",
        textTransform: "none"
      },
      caption: {
        fontSize: "0.725rem"
      },

    }
  })
}

export default customTheme;