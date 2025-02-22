import Figures from "../models/figures_model.js";

// Get all figures
export const getFigures = async (req, res) => {
    try {
        // const data = await Figures.findAll();
        const figures = await Figures.findOne({ id: 1 });
        res.status(200).json(figures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get balance
export const getBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const figure = await Figures.findByPk(id, { attributes: ['balance'] });

        if (!figure) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ balance: figure.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get paid capital
export const getPaidCapital = async (req, res) => {
    try {
        const { id } = req.params;
        const figure = await Figures.findByPk(id, { attributes: ['paidCapital'] });

        if (!figure) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ paidCapital: figure.paidCapital });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan delivered
export const getLoanDelivered = async (req, res) => {
    try {
        const { id } = req.params;
        const figure = await Figures.findByPk(id, { attributes: ['loanDelivered'] });

        if (!figure) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ loanDelivered: figure.loanDelivered });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get total penalties
export const getPenalties = async (req, res) => {
    try {
        const { id } = req.params;
        const figure = await Figures.findByPk(id, { attributes: ['penalties'] });

        if (!figure) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ penalties: figure.penalties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific figure record by ID
export const getFigureById = async (req, res) => {
    try {
        const figure = await Figures.findByPk(req.params.id);
        if (!figure) return res.status(404).json({ message: "Record not found" });

        res.status(200).json(figure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a figure (e.g., increase balance, add penalties)
export const updateFigure = async (req, res) => {
    try {
        const { balance, paidCapital, loanDisbursed, penalties } = req.body;

        const figure = await Figures.findByPk(req.params.id);
        if (!figure) return res.status(404).json({ message: "Record not found" });

        await figure.update({ balance, paidCapital, loanDisbursed, penalties });

        res.status(200).json({ message: "Figures updated successfully", figure });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset all figures to zero
export const resetFigures = async (req, res) => {
    try {
        await Figures.update(
            { balance: 0.00, paidCapital: 0.00, loanDisbursed: 0.00, penalties: 0.00 },
            { where: {} }  // Update all rows
        );

        res.status(200).json({ message: "All figures reset to zero" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a single column (balance, paidCapital, loanDelivered, penalties, ..)
export const updateSingleColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const { balance, paidCapital, loanDelivered, penalties } = req.body;

        const figure = await Figures.findByPk(id);
        if (!figure) return res.status(404).json({ message: "Record not found" });

        // Check which column is being updated
        const updateData = {};
        if (balance !== undefined) updateData.balance = balance;
        if (paidCapital !== undefined) updateData.paidCapital = paidCapital;
        if (loanDelivered !== undefined) updateData.loanDelivered = loanDelivered;
        if (penalties !== undefined) updateData.penalties = penalties;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        await figure.update(updateData);

        res.status(200).json({ message: "Column updated successfully", updatedData: updateData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

