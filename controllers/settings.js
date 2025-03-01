import Settings from '../models/settings_model.js'; // Adjust the path to your Settings model

// All system settings
export const allSystemSettings = async () => {
    return await Settings.findOne();
};

// Fetch system settings
export const getSystemSettings = async (req, res) => {
    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
    }
};

// Update system settings
const updateSettings = async (updatedData) => {
    await Settings.update(
        { settingsData: updatedData },
        { where: { id: 1 } }
    );
};

// Update system name
export const updateSystemName = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.name = name;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system abbreviation
export const updateSystemAbrev = async (req, res) => {
    const { abrev } = req.body;
    if (!abrev) return res.status(400).json({ message: 'Abrev is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.abrev = abrev;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system abbreviation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system email
export const updateSystemEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.email = email;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system phone
export const updateSystemPhone = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.phone = phone;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system phone:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system P.O. Box
export const updateSystemPobox = async (req, res) => {
    const { pobox } = req.body;
    if (!pobox) return res.status(400).json({ message: 'P.O. Box is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.pobox = pobox;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system P.O. Box:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system motto
export const updateSystemMotto = async (req, res) => {
    const { motto } = req.body;
    if (!motto) return res.status(400).json({ message: 'Motto is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.motto = motto;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system motto:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system website
export const updateSystemWebsite = async (req, res) => {
    const { website } = req.body;
    if (!website) return res.status(400).json({ message: 'Website is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.website = website;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system website:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system izinaRyUbutore
export const updateSystemIzinaRyUbutore = async (req, res) => {
    const { izinaRyUbutore } = req.body;
    if (!izinaRyUbutore) return res.status(400).json({ message: 'IzinaRyUbutore is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.izinaRyUbutore = izinaRyUbutore;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system izinaRyUbutore:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system manager
export const updateSystemManager = async (req, res) => {
    const { manager } = req.body;
    if (!manager) return res.status(400).json({ message: 'Manager is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.manager = manager;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system);
    } catch (error) {
        console.error('Error updating system manager:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update system address
export const updateSystemAddress = async (req, res) => {
    const { country, district, sector, cell } = req.body;
    if (!country || !district || !sector || !cell) return res.status(400).json({ message: 'All address fields are required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.system.address = { country, district, sector, cell };
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.system.address);
    } catch (error) {
        console.error('Error updating system address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update members types
export const updateMembersTypes = async (req, res) => {
    const { types } = req.body;
    if (!types) return res.status(400).json({ message: 'Types are required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.members.types = types;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.members.types);
    } catch (error) {
        console.error('Error updating members types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update members roles
export const updateMembersRoles = async (req, res) => {
    const { roles } = req.body;
    if (!roles) return res.status(400).json({ message: 'Roles are required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        // settings.settingsData.members.roles = roles;
        // console.log(`_________ reached: ${JSON.parse(settings.settingsData)}`);
        console.log(`_________ reached: ${settings}`);
        // await updateSettings(settings.settingsData);

        // res.status(200).json(settings.settingsData.members.roles);
        res.status(200).json(settings);
    } catch (error) {
        console.error('Error updating members roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update savings monthly due day
export const updateSavingsMonthlyDueDay = async (req, res) => {
    const { monthlyDueDay } = req.body;
    if (!monthlyDueDay) return res.status(400).json({ message: 'Monthly due day is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.savings.monthlyDueDay = monthlyDueDay;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.savings.monthlyDueDay);
    } catch (error) {
        console.error('Error updating savings monthly due day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update savings cotisation amount
export const updateSavingsCotisationAmount = async (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const cotisation = settings.settingsData.savings.types.find(type => type.type === 'cotisation');
        if (!cotisation) return res.status(404).json({ message: 'Cotisation type not found' });

        cotisation.amount = amount;
        await updateSettings(settings.settingsData);

        res.status(200).json(cotisation);
    } catch (error) {
        console.error('Error updating savings cotisation amount:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update savings cotisation delay penalty amount
export const updateSavingsCotisationDelayPenaltyAmount = async (req, res) => {
    const { delayPenaltyAmount } = req.body;
    if (!delayPenaltyAmount) return res.status(400).json({ message: 'Delay penalty amount is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const cotisation = settings.settingsData.savings.types.find(type => type.type === 'cotisation');
        if (!cotisation) return res.status(404).json({ message: 'Cotisation type not found' });

        cotisation.delayPenaltyAmount = delayPenaltyAmount;
        await updateSettings(settings.settingsData);

        res.status(200).json(cotisation);
    } catch (error) {
        console.error('Error updating savings cotisation delay penalty amount:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update savings social amount
export const updateSavingsSocialAmount = async (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const social = settings.settingsData.savings.types.find(type => type.type === 'social');
        if (!social) return res.status(404).json({ message: 'Social type not found' });

        social.amount = amount;
        await updateSettings(settings.settingsData);

        res.status(200).json(social);
    } catch (error) {
        console.error('Error updating savings social amount:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update expenses types
export const updateExpensesTypes = async (req, res) => {
    const { types } = req.body;
    if (!types) return res.status(400).json({ message: 'Types are required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.expenses.types = types;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.expenses.types);
    } catch (error) {
        console.error('Error updating expenses types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update credits interests
export const updateCreditsInterests = async (req, res) => {
    const { interests } = req.body;
    if (!interests) return res.status(400).json({ message: 'Interests are required' });

    try {
        const settings = await allSystemSettings();
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        settings.settingsData.credits.interests = interests;
        await updateSettings(settings.settingsData);

        res.status(200).json(settings.settingsData.credits.interests);
    } catch (error) {
        console.error('Error updating credits interests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};