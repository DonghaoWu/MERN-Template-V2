# MERN-Template-V2(part 2)

## `Section: Backend`(Refactor backend database and User model and register route)

### `Summary`: In this documentation, we refactor backend database and User model and register route.

### `Check Dependencies`

(Back-end)
- express (part1)
- dotenv (part1)
- morgan (part1)
- mongoose (part2)
- colors (part2)
- jsonwebtoken (part2)
- bcryptjs (part2)

(Dev-dependencies)
- nodemon (part1)

### `Brief Contents & codes position`
- 2.1 Add new variables in config.env, `Location:./config/config.env`
- 2.2 Change code in db configuration, `Location:./config/db.js`
- 2.3 Change some code in server.js, `Location:./server.js`

- 2.4 Create new model for User, `Location:./models/User.js`
- 2.5 Refactor register route
- 2.6 Change the code in controllers, `Location:./controllers/auth.js`
- 2.7 Add a logger middleware (morgan), `Location:./server.js`

### `Step1: Add new variables in config.env`
#### `(*2.1)Location:./config/config.env`

```js
NODE_ENV=development
PORT=5000

MONGO_URI =mongodb+srv:...
JWT_SECRET=...
JWT_EXPIRE=...
```

### `Step2: Change code in db configuration`,
#### `(*2.2)Location:./config/db.js`

```js
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    console.log('MongoDB connected...'.yellow.bold);
}

module.exports = connectDB;
```
### `Comments:`
- 在这里取消了使用try catch的方法进行错误处理。

### `Step3: Change some code in server.js`
#### `(*2.3)Location:./server.js`

```js
//Load env vars
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

//packages
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

//Apply
const app = express();

//DB
connectDB();

//Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/*
Routes here!!
*/
app.use('/api/v2', require('./apis'));

const server = app.listen(PORT, () => console.log(`server is listening on port ${PORT} ===>`));

//Handle unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})
```

### `Comments:`

- Import the DB and connect it.

```js
const connectDB = require('./config/db');
connectDB();
```

- Add body parser middleware.(`An easy mistake!`)

```js
app.use(express.json());
```
- Add `unhandledRejection` error handler. Instead put try catch in db.js（要注意这里的`unhandledRejection`是一个内定义变量）

```js
const server = app.listen(PORT, () => console.log(`server is listening on port ${PORT} ===>`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})
```

### `Step4: Create new model for User`
#### `(*2.4)Location:./models/User.js`

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = () => {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('User', UserSchema);
```

### `Comments:`

- 这个模型的特色在于，把validation放在model，加入了model method概念，还有hook概念，后续改英文.

### `Step5: Create register route.(重新组织路由)`
#### `(*2.5)Location:./apis/index.js`

```js
const router = require('express').Router();

router.use('/auth', require('./auth'));

module.exports = router;
```

#### `(*2.6)Location:./apis/auth.js`

```js
const router = require('express').Router();
const {
    register,
} = require('../controllers/auth')

router.post('/register', register);

module.exports = router;
```

#### `(*2.7)Location:./controllers/auth.js`

```js
// @desc       Register user
// @route      Post /api/v2/auth/register
// @access     Public
const User = require('../models/User');

exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success:true,
        token: token
    })
}
```

### Step6 : TEST

- Set up header ----> content-type: Application/json.
<p align="center">
<img src="../assets/205.png" width=85%>
</p>

- Edit the raw body, send the request and get token back.
<p align="center">
<img src="../assets/206.png" width=85%>
</p>

- New user with encrypted password in Altas is created.
<p align="center">
<img src="../assets/207.png" width=85%>
</p>