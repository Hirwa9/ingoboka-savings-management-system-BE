import Settings from "../models/SettingsModel.js"; // Import your Settings model

// Get system settings
export const getSystemSettings = async (req, res) => {
    try {
        const settings = await Settings.findAll();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get system settings', details: error.message });
    }
};

// Save system settings
export const saveSystemSettings = async (req, res) => {
    try {
        const { logo, stamp, name, email, phone, POBox, motto, website, izinaRyUbutore, manager, location } = req.body;

        const updatedSettings = await Settings.update({
            logo,
            stamp,
            name,
            email,
            phone,
            poBox: POBox,
            motto,
            website,
            izinaRyUbutore,
            manager,
            locationCountry: location?.country,
            locationDistrict: location?.district,
            locationSector: location?.sector,
            locationCell: location?.cell,
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save system settings" });

        res.json({ message: "System settings saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Save roles
export const saveRoles = async (req, res) => {
    try {
        const { roles } = req.body;

        const updatedSettings = await Settings.update({
            roleSettings: roles
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save roles" });

        res.json({ message: "Roles saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Save credit settings
export const saveCreditSettings = async (req, res) => {
    try {
        const { creditInterest5, creditInterest10, creditPenalty } = req.body;

        const updatedSettings = await Settings.update({
            creditInterest5,
            creditInterest10,
            creditPenalty
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save credit settings" });

        res.json({ message: "Credit settings saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Save share settings
export const saveShareSettings = async (req, res) => {
    try {
        const { shareValuePerShare } = req.body;

        const updatedSettings = await Settings.update({
            shareValuePerShare
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save share settings" });

        res.json({ message: "Share settings saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Save expense types
export const saveExpenseTypes = async (req, res) => {
    try {
        const { types } = req.body;

        const updatedSettings = await Settings.update({
            expenseTypes: types
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save expense types" });

        res.json({ message: "Expense types saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Save savings settings
export const saveSavingsSettings = async (req, res) => {
    try {
        const { savingsDueDate, savingsDelayPenalty } = req.body;

        const updatedSettings = await Settings.update({
            savingsDueDate,
            savingsDelayPenalty
        }, { where: { id: 1 } });

        if (!updatedSettings) return res.status(400).json({ message: "Failed to save savings settings" });

        res.json({ message: "Savings settings saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};