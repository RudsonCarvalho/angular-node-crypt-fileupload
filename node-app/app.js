var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
const {Security} = require('./security');
const cors = require('cors')
const DIR_FILE_SAVE = './uploads/';
const KEY_FILE_ENCRYPTION = "1234";
const URI_PATH_FILE_UPLOAD = '/upload';
const SERVER_PORT = '3001';


//multers disk storage settings
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, DIR_FILE_SAVE);
    },
    filename: function (req, file, cb) {
        console.log('REQ: ', req)
        console.log('FILE: ', file)

        var datetimestamp = Date.now();            
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

//multer settings
var upload = multer({
                storage: storage
            }).single('file');

app.use(cors());
//allow cross origin requests
app.use(function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

/** Serving from the same express Server
    No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json()); 

/** API path file upload */
app.post(URI_PATH_FILE_UPLOAD, function(req, res) {
    console.clear()
    console.log('REQ 2', req.headers)
    console.log('REQ 2', req.body)
    //console.log('RES 2', res)
    upload(req,res,function(err){
        
        if(err){
             console.log(err);
             res.json({error_code:1,err_desc:err});
             return;
        }
            
        console.log(req.file);

        security = new Security(req.file.path, KEY_FILE_ENCRYPTION);
        //security.encrypt();        
        security.decrypt();

        res.json({error_code:0,err_desc:null});
    });
});

app.listen(SERVER_PORT, function(){
    console.log('running on ' + SERVER_PORT);
    console.log('Post a file to: http://localhost:' + SERVER_PORT + URI_PATH_FILE_UPLOAD);
});