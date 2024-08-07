import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import models from './models';
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
let port = process.env.PORT || 45459;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
app.use(cors());

// force: true will drop the table if it already exits
// models.sequelize.sync({ force: true }).then(() => {
models.sequelize.sync().then(() => {
  console.log('Drop and Resync with {force: true}');
});

// passport middleware
app.use(passport.initialize());
// passport config
require('./config/passport')(passport);

//default route
app.get('/', (req, res) => res.send('BASOVCA Blog api is working'));
require('./routes/user.js')(app);

//create a server
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
//# sourceMappingURL=index.js.map