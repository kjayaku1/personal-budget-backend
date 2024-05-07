const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        min: 1,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        min: 1,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // min: 8,
    },
    validUser: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: Number,
        default: 0,
    },
    loginedInTime: [
        {
            type: Date,
        }
    ],
    budgets: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Budgets',
        }
    ],
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date(),
    }
});

RegisterSchema.pre("save", async function (next) {
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Users", RegisterSchema);