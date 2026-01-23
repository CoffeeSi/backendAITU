const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/measurements")

const measurementSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    precipitation: Number,
    temp_max: Number,
    temp_min: Number,
    wind: Number,
    weather: String
});

const measurement = mongoose.model("Measurement", measurementSchema)

VALID_FIELDS = [
    "precipitation",
    "temp_max",
    "temp_min",
    "wind",
]

app.get("/api/measurements", async (req, res) => {
    const {
        field, 
        start_date, 
        end_date
    } = req.query;

    if (field == null || start_date == null || end_date == null) {
        return res.status(400).send({
            error: "field, start_date, end_date are required"
        })
    }

    if (!VALID_FIELDS.includes(field)) {
        return res.status(400).send({
            error: "Invalid field parameter"
        })
    }

    if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
        return res.status(400).send({
            error: "Invalid date format"
        })
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).send({
            error: "start_date cannot be later than end_date"
        })
    }
    
    const data = await measurement.find({
        timestamp: {
            $gte: new Date(start_date),
            $lte: new Date(end_date)
        },
        [field]: { $exists: true }
    }, {timestamp: 1, [field]: 1})
    .sort({ timestamp: 1 });

    if (data.length === 0) {
        return res.status(404).send({
            error: "No data found for the given parameters"
        })
    }

    const response = data.map(entry => ({
        timestamp: entry.timestamp,
        [field]: entry[field]
    }));
    res.status(200).json({Response: response});
})

app.get("/api/measurements/metrics", async (req, res) => {
    const { field } = req.query;
    if (field == null) {
        return res.status(400).send({
            "error": "field is requierd"
        })
    }

    const data = await measurement.aggregate([
        { $match: { [field]: { $exists: true } } },
        { $group: {
            _id: null,
            avg: { $avg: `$${field}` },
            min: { $min: `$${field}` },
            max: { $max: `$${field}` },
            stdDev: { $stdDevSamp: `$${field}` }
        } }
    ]);

    if (data.length === 0) {
        return res.status(404).send({
            error: "No data found for the given field"
        })
    }

    const response = data.map(entry => ({
        avg: entry.avg,
        min: entry.min,
        max: entry.max,
        stdDev: entry.stdDev
    }))[0];

    res.status(200).json({
        Response: response
    })
})
app.listen("3000", () => {
    console.log("http://localhost:3000")
})