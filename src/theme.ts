import { createTheme } from "@mui/material";
// import { red } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        background: {
            paper: '#fff',
        },
        text: {
            primary: '#173A5E',
            secondary: '#46505A',
        },
        action: {
            active: '#001E3C',
        }
    },
});

export default theme;
