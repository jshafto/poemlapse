export const themeObj = {
    typography: {
        button: {
            textTransform: 'none',
            fontFamily: `"Nunito Sans", "Futura", "Helvetica", sans-serif `
        },
        fontFamily: `"Nunito Sans", "Futura", "Helvetica", sans-serif `
    },
    props: {
        // Name of the component ⚛️
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true,
        },
    },
    palette: {
        primary: {
            main: "#FFCED4",
            dark: "#FFA4B9"
        },
        background: {
            default: "#FFF5EE",
        },

    },
    overrides: {
        MuiToggleButton: {
            root: {
                '&$selected': {
                    backgroundColor: "rgba(255,145,175,0.7)",
                    '&:hover': {
                        backgroundColor: "rgba(255,145,175,0.7)",
                    }
                },
                '&:hover': {
                    backgroundColor: "rgba(255,145,175,0.3)",
                }

            },
        }
    },
}
