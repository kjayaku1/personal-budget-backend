
const User = require("../models/register.model");
const errorMessages = require("../utils/validationErrMsg");

let RegisterUser = async (req, res) => {
    const data = req.body;
    try {
        const userData = await User.findOne({ email: data?.email });
        if (userData) return res.status(400).json({ message: "User email is already registered" });

        const addUser = new User({ ...data, validUser: true });
        await addUser.save();
        res.status(200).json({ message: "User Registered successfully" });

    } catch (error) {
        res.status(400).json({ message: 'Unable to register', errors: errorMessages(error) });
    }
};

module.exports = {
    RegisterUser,
}