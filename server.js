// //package
// const express = require('express');
// const dotenv = require('dotenv');
// const morgan = require('morgan');

// //Load env vars
// dotenv.config({ path: './config/config.env' })

// //apply
// const app = express();

// //port
// const PORT = process.env.PORT || 5000;

// //middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }
// //app.use(express.json({ extended: false }));


// /*
// DB here!
// */

// /*
// Routes here!!
// */
// app.use('/api/v2', require('./api'));

// app.listen(PORT, () => console.log(`server is listening on port ${PORT} ===>`));

//Load env vars
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

//packages
const express = require('express');
const morgan = require('morgan');

//Apply
const app = express();

//Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/*
Routes here!!
*/
app.use('/api/v2', require('./api'));

app.listen(PORT, () => console.log(`server is listening on port ${PORT} ===>`));