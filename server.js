const express = require('express');
const app = express();

let crashes = [];

app.use(express.static('public'))
app.use(express.json());


app.get('/log', (req, res) => {
    console.log(new Date().toLocaleString(), Object.entries(req.query).map(([key,value]) => `${key}=${value}`).join(" "));
    res.send('')
})
app.post('/crash', (req, res) => {
    console.log('crash', req.body)
    crashes.push(req.body);
    res.send('')
})
app.delete('/crashes', (req, res) => {
    crashes = []
    res.send('')
})
app.get('/crashes', (req, res) => {
    res.json(crashes)
})
app.listen(1234, () => {
    console.log('Started');
});