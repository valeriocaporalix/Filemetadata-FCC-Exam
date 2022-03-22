// Require Settings
var express = require('express');
var cors = require('cors');
require('dotenv').config()
var app = express();
let mySecret = process.env["MONGO_URI"];
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let multer = require('multer');

//Database Connection
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected With Database'); })
  .catch(err => { console.log('Error Connecting With Database'), err });

//App USE Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Schema Settings

const { Schema } = mongoose;

const FileUploaded = new Schema({
  name: { type: String },
  type: { type: String },
  size: { type: Number }
})

// Model Settings
const FileInfo = mongoose.model("FileInfo", FileUploaded);

//POST File Info
app.post("/api/fileanalyse", multer().single('upfile'), (req, res) => {

  let newFileUp = new FileInfo({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size 
  })
  let resObj = {};
  resObj["name"] = newFileUp.name;
  resObj["type"] = newFileUp.type;
  resObj["size"] = [newFileUp.size, "byte"];

  newFileUp.save((err, data) => {
    if(err) {
      return console.log("Server Error")
    } else {
      return console.log("File Information Downloaded")
    }
  })
  res.json(resObj)
})


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
