// init project
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const authn = require('./libs/authn');
const helmet = require('helmet');
const app = express();
app.use(helmet());



app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));


app.use((req, res, next) => {
  if (req.get('x-forwarded-proto') &&
     (req.get('x-forwarded-proto')).split(',')[0] !== 'https') {
    return res.redirect(301, `https://${req.get('host')}`);
  }
  req.schema = 'https';
  next();
});


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, res) => {
  res.render('webauthn.html');
});


app.get('/webauthn', (req, res) => {
  res.render('webauthn.html');
});


app.use('/authn', authn);


// listen for req :)
const https = require('https')
const fs = require('fs')
option = {
  key: fs.readFileSync('/etc/letsencrypt/live/demo.shinesoft.tk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/demo.shinesoft.tk/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/demo.shinesoft.tk/chain.pem')
}
const httpsServer = https.createServer(option, app);
httpsServer.listen('443');
