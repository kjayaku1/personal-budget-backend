const moment = require("moment");
const momentTimezone = require('moment-timezone');
const DashboardRouter = require("express").Router();
const Budget = require("../models/budgets.model");
const User = require("../models/register.model");
const requireLogin = require("../middleware/requireLogin");

DashboardRouter.post("/", requireLogin, async (req, res) => {
  let { fromDate, toDate } = req.body;
  let year = '2024'; // Assuming you want data for the year 2024

  try {
    // Calculate total amount
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
          totalAmount: { $sum: { $ifNull: ["$amount", 0] } }
        }
      }
    ]);

    // Ensure totalAmount is not empty before accessing its first element
    let totalAmountValue = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

    // Calculate category percentages
    let categoryPercentages = await Budget.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          category: "$_id",
          percentage: { $multiply: [{ $divide: ["$totalAmount", totalAmountValue] }, 100] }
        }
      },
      {
        $project: {
          category: 1,
          percentage: { $round: ["$percentage", 2] }
        }
      }
    ]);

    // Calculate category sums
    let categorySums = await Budget.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Calculate daily sum of amounts
    let dailySum = await Budget.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          // _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          _id: "$date",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Define the start date and end date for the given year
    let startDate = momentTimezone.utc().year(year).month(0).date(1).startOf('day');
    let endDate = momentTimezone.utc().year(year).month(11).date(31).hour(23).minute(59).second(59).millisecond(999).startOf('day');

    // Convert start and end dates to local time (assuming US Eastern Time)
    startDate = startDate.tz('America/New_York').local();
    endDate = endDate.tz('America/New_York').local();

    // Calculate monthly total amounts
    let monthlyData = [];
    while (startDate.isSameOrBefore(endDate)) {
      // Define the start and end dates for the current month
      let startDateOfMonth = startDate.clone().startOf('month');
      let endDateOfMonth = startDate.clone().endOf('month');

      // Convert start and end dates of the month to UTC for database query
      let startDateOfMonthUTC = startDateOfMonth.utc();
      let endDateOfMonthUTC = endDateOfMonth.utc();

      // Calculate total amount for the current month
      let monthlyTotalAmounts = await Budget.aggregate([
        {
          $match: {
            user: req.userId,
            date: {
              $gte: startDateOfMonthUTC.toDate(),
              $lt: endDateOfMonthUTC.toDate()
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);

      // Find total amount for the current month
      let monthTotalAmount = monthlyTotalAmounts.length > 0 ? monthlyTotalAmounts[0].totalAmount : 0;

      // Push data for the current month to monthlyData array
      monthlyData.push({
        month: startDate.month() + 1,
        totalAmount: monthTotalAmount
      });

      // Move to the start of the next month
      startDate.add(1, 'month').startOf('day');
    }

    // Retrieve budget data
    let budget = await Budget.find(
      {
        user: req.userId,
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
      },
      { title: 1, category: 1, amount: 1, date: 1, status: 1, _id: 1 }
    );

    res.status(200).json({ budget, totalAmount: totalAmountValue, categoryPercentages, categorySums, dailySum, monthlyData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "User not registered" });
  }
});



module.exports = DashboardRouter;
