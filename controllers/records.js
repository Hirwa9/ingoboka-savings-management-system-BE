import Record from "../models/record_model.js";
import { allUsers } from "../controllers/users.js";
import { allFigures } from "./figures.js";
import User from "../models/user_model.js";

// All records
export const allRecords = async () => {
    return await Record.findAll();
}

// Get all credits
export const getRecords = async (req, res) => {
    try {
        const records = await allRecords();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records', details: error.message });
    }
};

// Add expense record
export const addExpense = async (req, res) => {
    const { secondaryType, expenseAmount, comment } = req.body;

    try {
        const users = await allUsers();
        const figures = await allFigures();

        if (!users || users.length === 0) return res.status(404).json({ error: 'No users found. Cannot process expense' });
        if (!figures) return res.status(404).json({ error: 'Figures records not found. They are essential for this to go through.' });

        const activeUsers = users.filter(user => user.status === 'active');
        const totalMembers = activeUsers.length;
        const totalSocial = activeUsers.reduce((sum, user) => sum + Number(user.social), 0);
        const totalInitialInterest = activeUsers.reduce((sum, user) => sum + Number(user.initialInterest), 0);
        const totalAvailableFunds = totalSocial + totalInitialInterest;

        if (expenseAmount > totalAvailableFunds) {
            return res.status(400).json({ error: "Insufficient funds. Expense cannot be recorded." });
        }

        const deductionPerMember = expenseAmount / totalMembers;
        const affectedUserIds = [];

        for (const user of activeUsers) {
            let remainingDeduction = deductionPerMember;

            if (Number(user.social) >= remainingDeduction) {
                user.social = Number(user.social) - remainingDeduction;
            } else {
                remainingDeduction -= Number(user.social);
                user.social = 0;

                if (user.initialInterest >= remainingDeduction) {
                    user.initialInterest -= remainingDeduction;
                } else {
                    return res.status(500).json({ error: `Failed to deduct ${deductionPerMember.toLocaleString()} RWF for user ${user.username}. Insufficient funds.` });
                }
            }

            await user.save();
            affectedUserIds.push(user.id);
        }

        await figures.decrement('balance', { by: Number(expenseAmount) });

        await Record.create({
            memberId: 2,
            recordType: 'expense',
            recordSecondaryType: secondaryType,
            recordAmount: expenseAmount,
            // Add affected numbers' ids in the comment
            comment: `${comment} (${affectedUserIds.join(',')})`,
        });

        res.status(200).json({ message: "Expense recorded successfully." });
    } catch (error) {
        console.error("Error recording the expense:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit expense record
export const editExpense = async (req, res) => {
    const { id, newExpenseAmount } = req.body;

    try {
        const record = await Record.findByPk(id);
        if (!record) return res.status(404).json({ error: "Expense record not found." });

        const oldAmount = Number(record.recordAmount);
        const amountDifference = oldAmount - Number(newExpenseAmount);

        const users = await allUsers();
        const figures = await allFigures();

        // Extract affected numbers' ids from the comment
        const affectedUserIds = record.comment.slice(record.comment.indexOf('('))
            .match(/\d+/g)?.map(Number) || [];
        const activeUsers = users.filter(user => affectedUserIds.includes(user.id) && user.status === 'active');
        const totalMembers = activeUsers.length;

        if (totalMembers === 0) return res.status(400).json({ error: "No active users found for this transaction." });

        const adjustmentPerMember = amountDifference / totalMembers;

        // **First loop: Check if all users can handle the adjustment**
        for (const user of activeUsers) {
            let remainingAdjustment = adjustmentPerMember;
            const userSocialAmount = Number(user.social);
            const userInterestAmount = Number(user.initialInterest);

            // **If deduction is happening (amountDifference < 0), check if the user has enough funds**
            if (amountDifference < 0) {
                if (userSocialAmount + userInterestAmount < Math.abs(remainingAdjustment)) {
                    return res.status(400).json({ error: `User ${user.username} has insufficient funds.` });
                }
            }
        }

        // **Second loop: Apply the adjustment**
        for (const user of activeUsers) {
            let remainingAdjustment = adjustmentPerMember;
            let userSocialAmount = Number(user.social);
            let userInterestAmount = Number(user.initialInterest);

            if (remainingAdjustment > 0) {
                // Refund scenario (users get money back)
                user.social = Number(user.social) + remainingAdjustment;
            } else {
                // Deduction scenario (users pay)
                remainingAdjustment = Math.abs(remainingAdjustment);

                if (userSocialAmount >= remainingAdjustment) {
                    user.social = Number(user.social) - remainingAdjustment;
                } else {
                    remainingAdjustment -= userSocialAmount;
                    user.social = 0;
                    user.initialInterest -= remainingAdjustment;
                }
            }

            await user.save();
        }

        // Update total balance in figures
        await figures.increment('balance', { by: amountDifference });

        // Update the record
        record.recordAmount = newExpenseAmount;
        await record.save();

        res.status(200).json({ message: "Expense record updated successfully." });

    } catch (error) {
        console.error("Error editing the expense:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Delete expense record
export const deleteExpense = async (req, res) => {
    const { id } = req.body;

    console.log("ID__________", id)
    try {
        const record = await Record.findByPk(id);
        if (!record) return res.status(404).json({ error: "Expense record not found." });

        const oldAmount = Number(record.recordAmount);
        const users = await allUsers();
        const figures = await allFigures();

        // Extract affected numbers' ids from the comment
        const affectedUserIds = record.comment.slice(record.comment.indexOf('('))
            .match(/\d+/g)?.map(Number) || [];
        const activeUsers = users.filter(user => affectedUserIds.includes(user.id) && user.status === 'active');
        const totalMembers = activeUsers.length;

        if (totalMembers === 0) return res.status(400).json({ error: "No active users found for this transaction." });

        const refundPerMember = oldAmount / totalMembers;

        for (const user of activeUsers) {
            user.social = Number(user.social) + refundPerMember;
            await user.save();
        }

        await figures.increment('balance', { by: oldAmount });
        await record.destroy();

        res.status(200).json({ message: "🗑️ Expense record deleted successfully, and associated members were refund" });
    } catch (error) {
        console.error("Error deleting the expense:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Add penalty record and distribute among users
export const addCreditPenalty = async (req, res) => {
    const { id } = req.params;
    const { secondaryType, penaltyAmount, comment } = req.body;

    try {
        // Fetch all required data first
        const figures = await allFigures();
        const users = await allUsers();
        const currentUser = users.find(u => u.id === Number(id));
        const totalUsers = users.length;

        // Ensure required data exists before proceeding
        if (!figures) {
            return res.status(500).json({ message: "Figures data not found." });
        }
        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }
        if (totalUsers === 0) {
            return res.status(500).json({ message: "No users found." });
        }

        // Compute the penalty share per user
        const individualPenalty = penaltyAmount / totalUsers;

        // Now proceed with database updates
        await Promise.all([
            Record.create({
                memberId: id,
                recordType: 'penalty',
                recordSecondaryType: secondaryType,
                recordAmount: penaltyAmount,
                comment,
            }),
            figures.increment({
                penalties: penaltyAmount,
                balance: penaltyAmount,
            }),
            ...users.map(user => user.increment('initialInterest', { by: individualPenalty }))
        ]);

        // Return success response only if all operations succeed
        res.status(200).json({
            message: `${penaltyAmount.toLocaleString()} RWF penalty applied to ${currentUser.username} and distributed successfully.`
        });

    } catch (error) {
        console.error("Error applying penalty:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};
