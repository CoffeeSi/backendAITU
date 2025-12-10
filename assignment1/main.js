// const http = require("http")

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain'})
//     res.end("Welcome");
// })

// server.listen(3000, () => { console.log("http://localhost:3000"); })

const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="card">
        <h1>BMI Calculator</h1>
        <form action="/calculate-bmi" method="post">
            <label class="input-label" for="inp-weight">Weight</label>
            <input class="input" type="number" name="weight" id="inp-weight" required><br>
            <label class="input-label" for="inp-weight">Height</label>
            <input class="input" type="number" name="height" id="inp-height" required><br>
            <button type="submit">Submit</button>
        </div>
        </form>
    `);
})

app.post('/calculate-bmi', (req,res) => {
    let weight = req.body.weight;
    let height = req.body.height;

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).send(`
            <script>alert("Invalid weight or height value")</script>
            `);
    }

    let bmi = weight / ((height/100) * (height/100));
    bmi = bmi.toFixed(2);
    let category;
    let color = "#ffffff";

    if (bmi < 18.5) {
        category = "Underwight";
        color = "#ffee8c";
    } else if (bmi < 24.9) {
        category = "Normal weight";
        color = "#80ef80";
    } else if (bmi < 29.9) {
        category = "Overweight";
        color = "#ffee8c";
    } else {
        category = "Obese"
        color = "#ff2c2c";
    }
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="card">
            <h1>BMI Results</h1>
            <p>Your BMI = <strong style="color:${color}">${bmi}</strong></p>
            <p>Your catergory = <strong style="color:${color}">${category}</strong></p>
        </div>`
    );
})

app.listen(3000, () => { console.log("http://localhost:3000");})
