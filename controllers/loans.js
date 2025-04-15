import Loan from '../models/loan_model.js';
import Record from '../models/record_model.js';
import { allFigures } from './figures.js';
import { allRecords } from './records.js';

// All loans
export const allLoans = async () => {
    return await Loan.findAll();
}

// Get all credits
export const getLoans = async (req, res) => {
    try {
        const loans = await allLoans();
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch loans', details: error.message });
    }
};

// Edit loan details
export const editLoanDetails = async (req, res) => {
    const { id } = req.params;
    const {
        loanTaken,
        loanPaid,
        loanPending,
        interestTaken,
        interestPaid,
        interestPending,
        tranchesTaken,
        tranchesPaid,
        tranchesPending,
    } = req.body;

    try {
        const loan = await Loan.findOne({ where: { memberId: id } });
        if (!loan) return res.status(404).json({ error: 'Loan details not found for this member' });

        // Update loan details
        loan.loanTaken = loanTaken ?? loan.loanTaken;
        loan.loanPaid = loanPaid ?? loan.loanPaid;
        loan.loanPending = loanPending ?? loan.loanPending;
        loan.interestTaken = interestTaken ?? loan.interestTaken;
        loan.interestPaid = interestPaid ?? loan.interestPaid;
        loan.interestPending = interestPending ?? loan.interestPending;
        loan.tranchesTaken = tranchesTaken ?? loan.tranchesTaken;
        loan.tranchesPaid = tranchesPaid ?? loan.tranchesPaid;
        loan.tranchesPending = tranchesPending ?? loan.tranchesPending;

        await loan.save();
        res.status(200).json({ message: 'Loan details updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Pay Loan
export const payLoan = async (req, res) => {
    const { id } = req.params;
    const { loanToPay, interestToPay, tranchesToPay } = req.body;

    try {
        const loan = await Loan.findByPk(id);
        const figures = await allFigures();
        const records = await allRecords();

        if (!loan) return res.status(404).json({ error: 'Loan details not found' });
        if (!figures) return res.status(404).json({ error: "Figures record not found" });
        if (!records) return res.status(404).json({ error: "Records not found" });

        const updatedLoanPaid = (Number(loan.loanPaid) || 0) + (Number(loanToPay) || 0);
        const updatedLoanPending = (Number(loan.loanPending) || 0) - (Number(loanToPay) || 0);

        const updatedInterestPaid = (Number(loan.interestPaid) || 0) + (Number(interestToPay) || 0);
        const updatedInterestPending = (Number(loan.interestPending) || 0) - (Number(interestToPay) || 0);

        const updatedTranchesPaid = (Number(loan.tranchesPaid) || 0) + (Number(tranchesToPay) || 0);
        const updatedTranchesPending = (Number(loan.tranchesPending) || 0) - (Number(tranchesToPay) || 0);

        if (updatedLoanPending < 0 || updatedInterestPending < 0 || updatedTranchesPending < 0) {
            return res.status(400).json({ error: 'Payment exceeds pending amounts' });
        }

        await loan.update({
            loanPaid: updatedLoanPaid,
            loanPending: updatedLoanPending,
            interestPaid: updatedInterestPaid,
            interestPending: updatedInterestPending,
            tranchesPaid: updatedTranchesPaid,
            tranchesPending: updatedTranchesPending
        });

        await figures.increment({
            balance: Number(loanToPay) + Number(interestToPay),
            paidInterest: interestToPay,
            paidCapital: loanToPay
        });

        await Record.create({
            memberId: id,
            recordType: 'loan',
            recordSecondaryType: 'payment',
            recordAmount: Number(loanToPay) + Number(interestToPay),
            comment: JSON.stringify({ loanPaid: Number(loanToPay), interestPaid: Number(interestToPay), tranchesPaid: Number(tranchesToPay) })
        });

        res.status(200).json({ message: 'Loan paid successfully', loan });
    } catch (error) {
        console.error('Error updating loan:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Delete Paid Loan
export const deletePaidLoan = async (req, res) => {
    const { recordId, memberId } = req.body;

    try {
        const record = await Record.findOne({ where: { id: recordId, memberId } });
        const loan = await Loan.findOne({ where: { memberId } });
        const figures = await allFigures();

        if (!record) return res.status(404).json({ error: "Payment record not found." });
        if (!loan) return res.status(404).json({ error: "Loan details not found." });
        if (!figures) return res.status(404).json({ error: "Figures record not found." });

        // Parse payment data
        const oldData = JSON.parse(record.comment);
        const oldLoanToPay = Number(oldData.loanPaid) || 0;
        const oldInterestToPay = Number(oldData.interestPaid) || 0;
        const oldTranchesToPay = Number(oldData.tranchesPaid) || 0;

        // Check if the payment data exists
        if (!oldLoanToPay && !oldInterestToPay && !oldTranchesToPay) {
            return res.status(400).json({ error: "No payment data found." });
        }

        // Check if the payment can be reversed
        if (Number(figures.balance) < (oldLoanToPay + oldInterestToPay)) {
            return res.status(400).json({ error: "Insufficient balance to reverse payment." });
        }

        // Reverse loan effects
        loan.loanPaid -= oldLoanToPay;
        loan.loanPending += oldLoanToPay;
        loan.interestPaid -= oldInterestToPay;
        loan.interestPending += oldInterestToPay;
        loan.tranchesPaid -= oldTranchesToPay;
        loan.tranchesPending += oldTranchesToPay;

        await loan.save();

        // Reverse figures updates
        await figures.increment({
            balance: -(oldLoanToPay + oldInterestToPay),
            paidInterest: -oldInterestToPay,
            paidCapital: -oldLoanToPay
        });

        // Delete record
        await record.destroy();

        res.status(200).json({ message: "Loan payment deleted successfully." });
    } catch (error) {
        console.error("Error deleting loan payment:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Create loan entry for a new member
export const createLoanEntry = async (req, res) => {
    const { memberId, loanTaken, interestTaken, tranchesTaken } = req.body;

    try {
        const newLoan = await Loan.create({
            memberId,
            loanTaken: loanTaken || 0,
            loanPaid: 0,
            loanPending: loanTaken || 0,
            interestTaken: interestTaken || 0,
            interestPaid: 0,
            interestPending: interestTaken || 0,
            tranchesTaken: tranchesTaken || 0,
            tranchesPaid: 0,
            tranchesPending: tranchesTaken || 0,
        });

        res.status(201).json({ message: 'Loan entry created successfully', loan: newLoan });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
