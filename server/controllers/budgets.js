const moment = require("moment");
const Budget = require("../models/budgets.model");
const User = require("../models/register.model");
const errorMessages = require("../utils/validationErrMsg");

let AddBudgets = async (req, res) => {
  let { title, category, amount, date } = req.body;
  try {
    let budget = await new Budget({
      title, category, amount,
      date: date,
      user: req.userId,
    });
    let budgetData = await budget.save();
    await User.updateOne(
      { _id: req.userId },
      { $push: { budgets: budgetData._id } }
    );

    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(400).json({ message: errorMessages(error) });
  }
};

let GetBudgets = async (req, res) => {
  if (req.userId) {
    try {
      let budget = await Budget.find(
        { user: req.userId, status: true },
        { title: 1, category: 1, amount: 1, date: 1, _id: 1 }
      );
      res.status(200).json(budget);
    } catch (error) {
      res.status(400).json({ message: "User not registered" });
    }
  } else {
  }
};

let GetBudgetsAll = async (req, res) => {
  if (req.userId) {
    try {
      let budget = await Budget.find(
        { user: req.userId },
        { title: 1, category: 1, amount: 1, date: 1, status: 1, _id: 1 }
      );
      res.status(200).json(budget);
    } catch (error) {
      res.status(400).json({ message: "User not registered" });
    }
  } else {
  }
};

let RemoveBudgetItem = async (req, res) => {
  if (req.params.id && req.userId) {
    try {
      await Budget.updateOne(
        { _id: req.params.id, user: req.userId },
        { $set: { status: false } }
      );
      res.status(200).json({ message: "Budget removed successfully" });
    } catch (error) {
      res.status(400).json({ message: "User id (or) Budget id not vaild" });
    }
  } else {
    res.status(422).json();
  }
};

let UpdateBudgetItem = async (req, res) => {
  let { title, category, amount } = req.body;
  if (req.params.id && req.userId) {
    try {
      await Budget.updateOne(
        { _id: req.params.id, user: req.userId },
        { $set: { title, category, amount } }
      );
      res.status(200).json({ message: "Budget message updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "User id (or) Budget id not vaild" });
    }
  } else {
    res.status(422).json();
  }
};

let GetMonthlyBudgetTable = async (req, res) => {
  let { fromDate, toDate } = req.body;
  try {
    let totalAmount = await Budget.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let budget = await Budget.find(
      {
        user: req.userId,
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
      },
      { title: 1, category: 1, amount: 1, date: 1, status: 1, _id: 1 }
    ).sort({ date: 1 });

    res.status(200).json({ budget, totalAmount: totalAmount.length > 0 ? totalAmount[0].totalAmount : 0 });
  } catch (error) {
    res.status(400).json({ message: errorMessages(error) });
  }
}


module.exports = {
  AddBudgets,
  GetBudgets,
  GetBudgetsAll,
  RemoveBudgetItem,
  UpdateBudgetItem,
  GetMonthlyBudgetTable,
};
