const BudgetsRouter = require("express").Router();
const requireLogin = require("../middleware/requireLogin");
const {
  AddBudgets,
  GetBudgets,
  GetBudgetsAll,
  RemoveBudgetItem,
  UpdateBudgetItem,
  GetMonthlyBudgetTable,
} = require("../controllers/budgets");

BudgetsRouter.post("/", requireLogin, AddBudgets);

BudgetsRouter.get("/", requireLogin, GetBudgets);

BudgetsRouter.get("/all", requireLogin, GetBudgetsAll);

BudgetsRouter.post("/remove/:id", requireLogin, RemoveBudgetItem);

BudgetsRouter.post("/update/:id", requireLogin, UpdateBudgetItem);

BudgetsRouter.post("/get/monthly-budget", requireLogin, GetMonthlyBudgetTable);

module.exports = BudgetsRouter;