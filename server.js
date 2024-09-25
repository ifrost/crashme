const express = require('express');
const app = express();

let crashes = [];

app.use(express.static('public'))
app.use(express.json());

function log(obj) {
    console.log(new Date().toLocaleString(), Object.entries(obj).map(([key,value]) => `${key}=${value}`).join(" "));
}

app.get('/log', (req, res) => {
    log(req.query);
    res.send('')
})
app.post('/crash', (req, res) => {
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
    console.log('Started http://localhost:1234');
});