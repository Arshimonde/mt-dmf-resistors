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
    styled,
    Button
} = MaterialUI;

const RED_INDEX = 0;
const GREEN_INDEX = 1;
const BLUE_INDEX = 2;

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

function renderSliders(sliderCount, onChangeValue) {
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
                        defaultValue={50}
                        marks={marks}
                        aria-label="resistor slider"
                        onChangeCommitted = {(e,value)=> onChangeValue(value, index, y)}
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
    const [client, setClient] = React.useState(null);
    const [resistor, setResistor] = React.useState({});
    const url = `ws://8.tcp.ngrok.io:16800/mqtt`;
    let options = {
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
      rejectUnauthorized: false,
    };
    options.username = "mqtt-user";
    options.password = "Ahiz@1733";
    const mqttConnect = (host, mqttOption) => {
        console.log('Connecting');
        return mqtt.connect(host, mqttOption);
    };

    React.useEffect(() => {
        if (client==null) {
            setClient(mqttConnect(url, options))
        }
    })

    React.useEffect(() => {
        if (client!=null) {
            client.on('connect', function () {
                client.subscribe('yasiji1996/humidity', function (err) {
                    if (!err) {
                      client.publish('yasiji1996/humidity', 'Hello mqtt')
                    }
                })
            })
        }
    },[client])


    const onSliderChange = React.useCallback((value, driverIndex, colorIndex) => {
        let tempResistorValue = resistor;
        if(colorIndex == RED_INDEX){
            tempResistorValue.red = value
        }else if (colorIndex == GREEN_INDEX){
            tempResistorValue.green = value
        }else if (colorIndex == BLUE_INDEX) {
            tempResistorValue.blue = value
        }

        setResistor(tempResistorValue)
      }, []);

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
                {renderSliders(1, onSliderChange)}
            </Grid>
            <Button variant="contained" onClick={()=> {
                if (client) {
                    client.publish('info/resistors', JSON.stringify(resistor))
                }
            }}>Submit</Button>
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