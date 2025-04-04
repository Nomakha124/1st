const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/real-estate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));

app.use(express.static('public'));

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/index.html');
    } catch (error) {
        res.status(500).send('Error registering new user. Please try again.');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials.');
        }
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Error logging in. Please try again.');
    }
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Dashboard endpoint (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Welcome to your dashboard!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



// property-listings
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/realhome', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Property Schema and Model
const propertySchema = new mongoose.Schema({
    name: String,
    price: Number,
    location: String,
    type: String,
    image: String
});
const Property = mongoose.model('Property', propertySchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// API routes for properties
app.get('/api/properties', async (req, res) => {
    const properties = await Property.find();
    res.json(properties);
});

app.post('/api/properties', async (req, res) => {
    const { name, price, location, type, image } = req.body;
    const newProperty = new Property({ name, price, location, type, image });
    await newProperty.save();
    res.json(newProperty);
});

app.put('/api/properties/:id', async (req, res) => {
    const { name, price, location, type, image } = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, { name, price, location, type, image }, { new: true });
    res.json(updatedProperty);
});

app.delete('/api/properties/:id', async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/index.html');
    } catch (error) {
        res.status(500).send('Error registering new user. Please try again.');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials.');
        }
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Error logging in. Please try again.');
    }
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Dashboard endpoint (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Welcome to your dashboard!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});