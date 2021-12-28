const {
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
    Container,
    createTheme,
    Box,
    SvgIcon,
    Link,
    Slider,
    Paper,
    Icon,
    Grid,Avatar,
    styled
} = MaterialUI;

const CustomSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: 13,
      bottom: 10,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&:before': {
        display: 'none',
      },
      '& *': {
        background: '#556cd6',
        color: '#fff',
        padding: 2,
        paddingLeft:3,
        paddingRight:3,
        borderRadius: 30
      },
    }
}));

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: colors.red.A400,
        },
    },
});
const ColorPalette = window.theme.palette
const redSliderTheme = createTheme({
    palette: {
        primary: {
            light: ColorPalette.error.light,
            main: ColorPalette.error.main,
            dark: ColorPalette.error.dark,
        },
    }
});
const greenSliderTheme = createTheme({
    palette: {
        primary: {
            light: ColorPalette.success.light,
            main: ColorPalette.success.main,
            dark: ColorPalette.success.dark,
        },
    }
});
const blueSliderTheme = createTheme({
    palette: {
        primary: {
            light: ColorPalette.primary.light,
            main: ColorPalette.primary.main,
            dark: ColorPalette.primary.dark,
        },
    }
});

function valuetext(value) {
    return `${value}`;
}

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 99,
        label: '99',
    },
];

function renderSliders(sliderCount) {
    let sliders = []
    let theme = redSliderTheme
    const newSliderCount = sliderCount / 3
    for (let index = 1; index < newSliderCount + 1; index++) {

        const pixelSlider = []
        for (let y = 0; y < 3; y++) {
            theme = redSliderTheme

            if (y == 1) {
                theme = greenSliderTheme
            } else if (y == 2) {
                theme = blueSliderTheme
            }

            pixelSlider[y] = (

                <ThemeProvider theme={theme} key={y}>
                    <CustomSlider
                        getAriaValueText={valuetext}
                        step={1}
                        valueLabelDisplay="on"
                        min={0}
                        max={99}
                        defaultValue={0}
                        marks={marks}
                        aria-label="resistor slider"
                    />
                </ThemeProvider>

            )
        }
        sliders[index] = (
            <Grid item xs={12} sm={sliderCount == 1 ? 12: 4} key={index}>
                <Paper elevation={4} sx={{ mb: 2, px: 5, py: 2 }}>
                    {pixelSlider}
                </Paper>
            </Grid>
        );

    }

    return sliders
}


function App() {
    return (
        <Container maxWidth="lg" sx={{my:10}}>
            <Grid container spacing={2}>
                <Grid item>
                <Typography variant="h3">MT DMF</Typography>
                </Grid>
                <Grid sx={{ ml: "auto", width: 120, mb:3}}>
                    <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/6/6e/Maroc_telecom_logo.svg/1200px-Maroc_telecom_logo.svg.png" width={120} />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                
                {renderSliders(1)}
            </Grid>
        </Container>
    );
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.querySelector('#root'),
);