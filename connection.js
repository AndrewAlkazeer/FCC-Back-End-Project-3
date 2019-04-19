//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./mongoose');
const app = express();

const server = app.listen(3000, ()=>{
console.log('Connected!');
});

const url = 'mongodb://localhost:3000/shortUrls';
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))
// Connect to Mongoose
mongoose.connect(url);

app.get('/new/:urlToShorten', (req, res) =>{
    
    var urlToShorten = req.params.urlToShorten;
var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
if(regex.test(urlToShorten) === true){

var shortURL = Math.floor(Math.random()*100000).toString();

var data = new shortUrl({
originalUrl: urlToShorten,
shorterUrl: shortURL
});

data.save((err)=>{
    if(err){
        return res.send('Error saving to database');
    }
});

return res.json(data);
}
return res.json({urlToShorten: "Invalid URL"})
});

app.get('/:urlToForward', (req, res)=>{
var shorterUrl = req.params.urlToForward;

shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data)=>{
if(err) return res.send('Error reading database');
var re = new RegExp("^(http|https)://", "i");
var strToCheck = data.originalUrl;
if(re.test(strToCheck) === true){
    res.redirect(301, data.originalUrl);
} else{
    res.redirect(301, 'http://' + data.originalUrl);
}
});
});