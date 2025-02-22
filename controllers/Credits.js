import Credits from "../models/credit_model.js";
import Figures from "../models/figures_model.js";
import Loan from "../models/loan_model.js";

// Get all credits
export const getCredits = async (req, res) => {
    try {
        const credits = await Credits.findAll();
        res.status(200).json(credits);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch credits', details: error.message });
    }
};

// Get a single credit by ID
export const getCreditById = async (req, res) => {
    const { id } = req.params;
    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch credit', details: error.message });
    }
};

// Utility function to calculate tranche due dates
const calculateTrancheDueDates = (requestDate, tranches) => {
    const dueDates = [];
    const baseDate = new Date(requestDate);

    for (let i = 1; i <= tranches; i++) {
        const trancheDate = new Date(baseDate);
        trancheDate.setMonth(baseDate.getMonth() + i);

        // Adjust for the last day of the month if the base day is beyond available days
        if (trancheDate.getDate() < baseDate.getDate()) {
            trancheDate.setDate(0); // 0 means the last day of the previous month
        }

        dueDates.push(trancheDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }

    return dueDates;
};

// Create a new credit
export const createCredit = async (req, res) => {
    const {
        memberId,
        creditAmount,
        requestDate, // Now user-defined
        dueDate,
        tranches,
        comment,
        creditPayment,
    } = req.body;

    try {
        // Validate required fields
        if (!memberId || !creditAmount || !requestDate || !dueDate || !tranches) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate creditPayment array if not provided
        let generatedCreditPayment = [];
        if (!creditPayment || creditPayment.length === 0) {
            const trancheDueDates = calculateTrancheDueDates(requestDate, tranches);
            let interestPercentage = 0.05;
            generatedCreditPayment = trancheDueDates.map((date, index) => ({
                tranchNumber: index + 1,
                tranchDueDate: date,
                tranchAmount: (creditAmount * (1 + interestPercentage)) / tranches,
                paid: false,
                slipUrl: null,
                finesCount: 0,
            }));
        }

        // Create the credit record
        const newCredit = await Credits.create({
            memberId,
            creditAmount,
            requestDate, // User-defined request date
            dueDate,
            tranches,   // number of trenches
            comment,
            creditPayment: creditPayment || generatedCreditPayment, // Use provided or generated array
        });

        res.status(201).json({ message: 'Credit request submitted successfully! Your request will be processed accordingly.', newCredit });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create credit', details: error.message });
    }
};

// Update credit payment details
export const updateCreditPayment = async (req, res) => {
    const { id } = req.params;
    const { tranchNumber, paid, slipUrl, finesCount } = req.body;

    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });

        const payments = credit.creditPayment;
        const tranche = payments.find((t) => t.tranchNumber === tranchNumber);

        if (!tranche) return res.status(404).json({ error: 'Tranche not found' });

        // Update tranche details
        tranche.paid = paid !== undefined ? paid : tranche.paid;
        tranche.slipUrl = slipUrl !== undefined ? slipUrl : tranche.slipUrl;
        tranche.finesCount = finesCount !== undefined ? finesCount : tranche.finesCount;

        // Save updated credit
        credit.creditPayment = payments;
        await credit.save();

        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update credit payment', details: error.message });
    }
};

// Update credit status
export const updateCreditStatus = async (req, res) => {
    const { id } = req.params;
    const { status, rejectionMessage } = req.body;

    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });

        credit.status = status || credit.status;
        credit.rejectionMessage = rejectionMessage || credit.rejectionMessage

        await credit.save();

        const successMessage = status === 'rejected' ? 'The request is rejected'
            : status === 'pending' ? 'Request is restored successfully'
                : status === 'approved' ? 'Request is approved successfully. You can followup with tranches payment'
                    : 'Credit updated successfully';

        res.status(200).json({ message: successMessage, resData: credit });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update credit status', details: error.message });
    }
};

// Approve credit
export const approveCreditRequest = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the credit request
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: "Credit not found" });
        if (credit.status === "approved") return res.status(400).json({ error: "Credit is already approved" });

        // Fetch figures
        const figures = await Figures.findOne();
        if (!figures) return res.status(404).json({ error: "Figures record not found" });

        const creditAmount = Number(credit.creditAmount);

        // Ensure there are enough funds
        if (Number(figures.balance) < creditAmount) {
            return res.status(400).json({ error: "Insufficient balance to approve this loan" });
        }

        // Fetch or create the member's loan record
        let loan = await Loan.findOne({ where: { memberId: credit.memberId } });
        if (!loan) {
            loan = await Loan.create({
                memberId: credit.memberId,
                loanTaken: 0,
                loanPending: 0,
                interestTaken: 0,
                interestPending: 0,
                tranchesTaken: 0,
                tranchesPending: 0,
            });
        }

        // Calculate the interest (5% of the requested loan)
        const interest = parseFloat((creditAmount * 0.05).toFixed(2));

        // Update loan details
        loan.loanTaken += creditAmount;
        loan.loanPending += creditAmount;
        loan.interestTaken += interest;
        loan.interestPending += interest;
        loan.tranchesTaken += credit.tranches;
        loan.tranchesPending += credit.tranches;
        await loan.save();

        // Deduct from figures
        await figures.increment('loanDisbursed', { by: creditAmount });
        await figures.decrement('balance', { by: creditAmount });

        // Update credit status
        credit.status = "approved";
        credit.rejectionMessage = null;
        await credit.save();

        res.status(200).json({
            message: "Request approved successfully. You can follow up with tranche payments.",
            resData: credit,
        });
    } catch (error) {
        console.error("Error approving credit request:", error);
        res.status(500).json({ error: "Failed to approve credit request", details: error.message });
    }
};

// Delete a credit
export const deleteCredit = async (req, res) => {
    const { id } = req.params;

    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });

        await credit.destroy();
        res.status(200).json({ message: 'Credit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete credit', details: error.message });
    }
};

// Add a tranche to creditPayment
export const addTranche = async (req, res) => {
    const { id } = req.params;
    const { tranchNumber, tranchDueDate } = req.body;

    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });

        const payments = credit.creditPayment;
        payments.push({
            tranchNumber,
            tranchDueDate,
            paid: false,
            slipUrl: null,
            finesCount: 0,
        });

        credit.creditPayment = payments;
        await credit.save();

        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add tranche', details: error.message });
    }
};

// Mark credit as fully paid
export const markFullyPaid = async (req, res) => {
    const { id } = req.params;

    try {
        const credit = await Credits.findByPk(id);
        if (!credit) return res.status(404).json({ error: 'Credit not found' });

        credit.fullyPaid = true;
        credit.status = 'approved';
        await credit.save();

        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark credit as fully paid', details: error.message });
    }
};
