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

const searchWeather = document.querySelector('button')
searchWeather.addEventListener('click', (e) => {
    e.preventDefault()
    const query = document.querySelector('input[type="search"]')
    main(query.value)
})


function main(city = 'Włocławek') {
    const location = getWeather(city)

    location.then(json => getNeededData(json))
    .then(data => {
        const dataC = formatData(data)
        const dataF = formatData(data, 'F')
        displayTodayWeather(dataC)
        displayNextDays(dataC)
        const toggleScale = document.getElementById('scale')
        toggleScale.addEventListener('change', () => {
            if (toggleScale.checked) {
                displayTodayWeather(dataF)
            } else {
                displayTodayWeather(dataC)
            }
    })
    })
}

function getNeededData(json) {
    const data = {}

    data.temp = json.currentConditions.temp
    data.feelslike = json.currentConditions.feelslike
    data.windspeed = json.currentConditions.windspeed
    data.address = json.resolvedAddress
    data.conditions = json.currentConditions.conditions
    data.precip = json.currentConditions.precip
    data.humidity = json.currentConditions.humidity
    data.days = []

    for (let i = 0; i < 5; i++) {
        const day = {}

        day.date = json.days[i].datetime
        day.temp = json.days[i].temp
        day.tempmax = json.days[i].tempmax
        day.tempmin = json.days[i].tempmin
        day.feelslike = json.days[i].feelslike
        day.windspeed = json.days[i].windspeed
        day.conditions = json.days[i].conditions
        day.precip = json.days[i].precip
        day.humidity = json.days[i].humidity

        data.days.push(day)
    }
    console.log(data)
    return data
}

function formatData(data, scale = 'C') {
    const dataCopy = JSON.parse(JSON.stringify(data))

    if (scale === 'C') {
        dataCopy.temp = `${dataCopy.temp}° C`
        dataCopy.feelslike = `${dataCopy.feelslike}° C`
        dataCopy.windspeed = `${dataCopy.windspeed} km/h`
    } else {
        let tempF = calculateFahrenheit(dataCopy.temp)
        let feelslikeF = calculateFahrenheit(dataCopy.feelslike)
        let windspeedM = calculateMiles(dataCopy.windspeed)

        dataCopy.temp = `${tempF}° F`
        dataCopy.feelslike = `${feelslikeF}° F`
        dataCopy.windspeed = `${windspeedM} mph`
    }

    return dataCopy
}

function displayTodayWeather(data) {
    const location = document.getElementById('location');
    const temp = document.getElementById('temp')
    const feelTemp = document.getElementById('feelslike')
    const conditions = document.getElementById('conditions')
    const precipitation = document.getElementById('precip')
    const humidity = document.getElementById('humidity')
    const windspeed = document.getElementById('windspeed')

    location.textContent = data.address.split(',')[0]
    temp.textContent = `Temperature: ${data.temp}`
    feelTemp.textContent = `Feels-like temperature: ${data.feelslike}`
    conditions.textContent = `Current conditions: ${data.conditions}`
    precipitation.textContent = `Precipitation: ${data.precip || 0}%`
    humidity.textContent = `Air humidity: ${data.humidity}%`
    windspeed.textContent = `Wind speed: ${data.windspeed}`
}

function calculateFahrenheit(celcius) {
    const fahrenheit = (parseFloat(celcius) * (9 / 5)) + 32
    return parseFloat(fahrenheit).toFixed(1)
}

function calculateMiles(km) {
    const miles = parseFloat(km) * 0.621371
    return parseFloat(miles).toFixed(1)
}

function displayNextDays(data) {
    const container = document.querySelector('.next-days')
    container.innerHTML = '';
    for (let i = 0; i < data.days.length; i++) {
        const dayDiv = document.createElement('div')
        dayDiv.id = `day${i}`
        dayDiv.classList.add('days')

        const date = document.createElement('h3')
        date.textContent = data.days[i].date

        const temp = document.createElement('p')
        temp.textContent = `Temp: ${data.days[i].temp}`

        const tempMin = document.createElement('p')
        tempMin.textContent = `Temp min: ${data.days[i].tempmin}`

        const tempMax = document.createElement('p')
        tempMax.textContent = `Temp max: ${data.days[i].tempmax}`

        dayDiv.appendChild(date)
        dayDiv.appendChild(temp)
        dayDiv.appendChild(tempMin)
        dayDiv.appendChild(tempMax)
        container.appendChild(dayDiv)
    }
}


main()