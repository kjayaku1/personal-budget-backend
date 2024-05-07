const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();

const User = require("./models/register.model");

/**Custom Modules */
const databaseConnection = require('./database/conn');
const RegisterRouter = require('./routers/register');
const LoginRouter = require('./routers/login');
const BudgetsRouter = require('./routers/budgets');
const DashboardRouter = require('./routers/dashboard');
// const UserRouter = require('./routers/user');
// const NotificationRouter = require('./routers/notification');

/**Local Variables */
const secret = process.env.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm1234567890';
const refreshSecret = process.env.REFRESH_SECRET || 'poiuytrewqlkjhgfdsa0987654321';
const expiresIn = process.env.JWT_EXPIRES_IN || '5m';
const refreshExpiresIn = process.env.REFRESH_EXPIRES_IN || '7d';
const PORT = process.env.PORT || 4000;

/**Middleware */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
// app.use(upload.array());
// Use the express-fileupload middleware
// app.use(fileUpload());

/**Routers */
app.use('/register', RegisterRouter);
app.use('/login', LoginRouter);
app.use('/budget', BudgetsRouter);
app.use('/dashboard', DashboardRouter);
// app.use('/user', UserRouter);
// app.use('/notification', NotificationRouter)

/**Requests */
app.get("/", (req, res) => {
    res.status(200).send("Server Running Successfully");
});

app.post('/refresh/token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, refreshSecret);
        const { _id } = decoded;

        // Check if the user exists
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ _id: user._id }, secret, { expiresIn });

        // Send the new access token back to the client
        res.json({ access_token: accessToken });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


databaseConnection().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
    } catch (err) {
        console.error("Error : Could not connect to server");
    };
}).catch((err) => {
    console.error("Error : Invalid database connection", err);
});