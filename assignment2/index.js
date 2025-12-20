const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/profile', async (req, res) => {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const results = await data.results[0];

    let dob = results.dob.date;
    dob = dob.slice(0,10);

    const user = {
        firstName: results.name.first,
        lastName: results.name.last,
        gender: results.gender,
        profilePicture: results.picture.large,
        age: results.dob.age,
        dob: dob,
        city: results.location.city,
        country: results.location.country,
        fullAddress: `${results.location.street.number} ${results.location.street.name}`
    };
    res.send(user);
});

app.get('/country/:name', async (req, res) => {
    const countryName = req.params.name;

    const reposnse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await reposnse.json();
    const country = {
        name: data[0].name.common,
        capital: data[0].capital[0],
        languages: Object.values(data[0].languages).join(", "),
        currency: {
            name: Object.values(data[0].currencies)[0].name,
            code: Object.keys(data[0].currencies)[0]
        },
        flag: data[0].flags.png
    }

    res.json(country)
});

app.get('/currency/:currency', async (req, res) => {
    const api_key = process.env.EXCHANGERATE_KEY;
    const currency = req.params.currency;
    const dataUSD = await (await fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/${currency}/USD`)).json();
    const dataKZT = await (await fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/${currency}/KZT`)).json();

    const exchange_rate = {
        rateToUsd: dataUSD.conversion_rate,
        rateToKzt: dataKZT.conversion_rate
    };
    
    res.json(exchange_rate);
});

app.get('/news/:country', async (req, res) => {
    const api_key = process.env.NEWS_KEY;
    const country = req.params.country;

    const data = await (await fetch(`https://newsapi.org/v2/everything?q=${country}
        &apiKey=${api_key}&language=en&searchIn=title`)).json();

    const news = []
    let maxArticles = 5;
    for (let i = 0; i < maxArticles; i++) {
        const article = {
            title: data.articles[i].title,
            image: data.articles[i].urlToImage,
            description: data.articles[i].description,
            url: data.articles[i].url
        }
        if (article.description == null) {
            maxArticles++;
            continue;
        }
        if (article.image == null) {
            article.image = 'https://images.genius.com/6ad0fc1f11a9f3ffdc1ddbe3ece05821.1000x1000x1.png';
        }
        news.push(article);
    }

    res.json(news);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/profile.html")
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});