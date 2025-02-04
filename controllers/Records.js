import Record from "../models/RecordModel.js";

// Get all credits
export const getRecords = async (req, res) => {
    try {
        const records = await Record.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records', details: error.message });
    }
};

// Add expense record
export const addExpense = async (req, res) => {
    const { secondaryType, expenseAmount, comment } = req.body;

    try {
        await Record.create({
            memberId: 2,
            recordType: 'expense',
            recordSecondaryType: secondaryType,
            recordAmount: expenseAmount,
            comment,
        });

        res.status(200).json({ message: "Expense recorded successfully." });
    } catch (error) {
        console.error("Error recording the expense:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Add penalty record
export const addCreditPenalty = async (req, res) => {
    const { id } = req.params;
    const { secondaryType, penaltyAmount, comment } = req.body;

    try {
        await Record.create({
            memberId: id,
            recordType: 'penalty',
            recordSecondaryType: secondaryType,
            recordAmount: penaltyAmount,
            comment,
        });

        res.status(200).json({ message: "Penalty applied successfully." });
    } catch (error) {
        console.error("Error recording the expense:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};
