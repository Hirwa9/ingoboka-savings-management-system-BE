import AnnualInterest from "../models/annual_interests_model.js";

// Get all credits
export const getAnnualInterestRecords = async (req, res) => {
    try {
        const interest = await AnnualInterest.findAll();
        res.status(200).json(interest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch interest', details: error.message });
    }
};