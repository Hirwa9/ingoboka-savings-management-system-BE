import Figures from "../models/FiguresModel.js";
import Record from "../models/RecordModel.js";
import User from "../models/UserModel.js";

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
        // Fetch all active members
        const members = await User.findAll();
        const totalMembers = members.length;
        if (totalMembers === 0) {
            return res.status(400).json({ error: "No members found. Cannot process expense." });
        }

        // Calculate total available funds (sum of all members' social + initialInterest)
        const totalSocial = members.reduce((sum, member) => sum + Number(member.social), 0);
        const totalInitialInterest = members.reduce((sum, member) => sum + Number(member.initialInterest), 0);
        const totalAvailableFunds = totalSocial + totalInitialInterest;

        // Check if the total expense is greater than the available funds
        if (expenseAmount > totalAvailableFunds) {
            return res.status(400).json({ error: "Insufficient funds. Expense cannot be recorded." });
        }

        // Calculate the amount to deduct per member
        const deductionPerMember = expenseAmount / totalMembers;

        // Deduct from each member
        for (const member of members) {
            let remainingDeduction = deductionPerMember;

            // Deduct from social first
            if (member.social >= remainingDeduction) {
                member.social -= remainingDeduction;
            } else {
                // Deduct what's available in social
                remainingDeduction -= member.social;
                member.social = 0;

                // Deduct the rest from initialInterest
                if (member.initialInterest >= remainingDeduction) {
                    member.initialInterest -= remainingDeduction;
                } else {
                    return res.status(500).json({ error: `Failed to deduct ${deductionPerMember.toLocaleString()} RWF expenses for member ${member.username}. Insufficient funds.` });
                }
            }

            // Save the updated member details
            await member.save();
        }

        // Create the expense record
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

// Add penalty record and distribute among users
export const addCreditPenalty = async (req, res) => {
    const { id } = req.params;
    const { secondaryType, penaltyAmount, comment } = req.body;

    try {
        // Add penalty record
        await Record.create({
            memberId: id,
            recordType: 'penalty',
            recordSecondaryType: secondaryType,
            recordAmount: penaltyAmount,
            comment,
        });

        // Update Figures (penalties + balance)
        const figures = await Figures.findOne();
        await figures.increment({
            penalties: penaltyAmount,
            balance: penaltyAmount,
        });

        // Fetch all users
        const users = await User.findAll();
        const totalUsers = users.length;

        if (totalUsers > 0) {
            // Compute the exact share per user
            const individualPenalty = penaltyAmount / totalUsers;

            // Distribute penalty among all users
            await Promise.all(users.map(user => {
                return user.increment('initialInterest', { by: individualPenalty });
            }));
        }

        res.status(200).json({ message: "Penalty applied and distributed successfully." });
    } catch (error) {
        console.error("Error applying penalty:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

