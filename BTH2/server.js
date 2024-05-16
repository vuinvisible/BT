const express = require('express');
const cat = require('./cat');
const hostname = 'localhost';
const port = '8017';
const app = express();

app.get ('/', (req, res) => {
    let catsArr = ["Maine Coon", "Sphynx", "Toyger", "Balinese", "Burmese", "Russian Blue",
    "Turkish Van", "Exotic", "Selkirk Rex", "Korat"];

    let randomCat = cat.getRandomCat(catsArr);
    res.send(`<h1>Cat: <small>${randomCat}</small></h1><hr>`);
});

app.listen(port, hostname, () => {
    console.log(`Hello, I am running at ${hostname}:${port}/`);
});