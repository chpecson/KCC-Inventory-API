const EXPRESS = require('express');
const PATH = require('path');
const BODY_PARSER = require('body-parser');
const CORS = require('cors');
const PASSPORT = require('passport'); 
const MONGOOSE = require('mongoose');

const USERS = require('./routes/index');
const DB_CONFIG = require('./config/database');

const APP = EXPRESS();

const PORT = 4000;

/*
 * Connect to database
 */
MONGOOSE.connect(DB_CONFIG.database);

/*
 * Database on connection
 */
MONGOOSE.connection.on('connected', () => {
    console.log(`Connected to database: ${DB_CONFIG.database}`);
    console.log(`===================================================================`);
});

/*
 * Database on error
 */
MONGOOSE.connection.on('error', (error) => {
    console.error(`\nDb Error: ${error}`);
});

/*
 * Allow cross origin resource sharing.
 * It allows http requests to another ports. 
 */
APP.use(CORS());

/*
 * Serve the static files in public folder.
 */
APP.use(EXPRESS.static(PATH.join(__dirname, 'public')));


/*
 * Parse the request body as json. 
 */
APP.use(BODY_PARSER.json());

/*
 * Add the passport middleware.
 */
APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());
require('./config/passport')(PASSPORT);

APP.get('/', (req, res) => {
    res.send('Yo World!');
});

APP.use('/users', USERS);

/*
 * Redirect to homepage if the route does not exist.
 */
APP.get('**', (req, res) => {
    res.redirect('/');
});

/*
 * Start the server. 
 */
APP.listen(PORT, () => {
    console.log(`\n===================================================================`);
    console.log(`Server running in http://localhost:${PORT}`);
}) 