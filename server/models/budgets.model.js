const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Expense Title is required"],
        min: 1,
    },
    category: {
        type: String,
        required: [true, "Expense Category is required"],
        min: 1,
    },
    amount: {
        type: Number,
        required: [true, "Expense Amount is required"]
    },
    date: {
        type: Date,
        required: [true, "Expense Date is required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
    },
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

BudgetSchema.pre("save", async function (next) {
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Budgets", BudgetSchema);