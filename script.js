async function getWeather(location = 'Lubraniec') {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=EC2ZSM36XX2ZP43ZXSYLEWX4D&contentType=json`,
            {mode: 'cors'}
        );

        if (!response.ok) {
            throw new Error(`ERROR! Status: ${response.status}.`)
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(`Error fetchin weather data: `, error);
        return null;
    }
}


const wloclawekWeather = getWeather('Wloclawek')

wloclawekWeather.then(data => {
    console.log(data.currentConditions.temp)
})