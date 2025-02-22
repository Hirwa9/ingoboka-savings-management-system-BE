import express from 'express';
import {
    getSystemSettings,
    updateSystemName,
    updateSystemAbrev,
    updateSystemEmail,
    updateSystemPhone,
    updateSystemPobox,
    updateSystemMotto,
    updateSystemWebsite,
    updateSystemIzinaRyUbutore,
    updateSystemManager,
    updateSystemAddress,
    updateMembersTypes,
    updateMembersRoles,
    updateSavingsMonthlyDueDay,
    updateSavingsCotisationAmount,
    updateSavingsCotisationDelayPenaltyAmount,
    updateSavingsSocialAmount,
    updateExpensesTypes,
    updateCreditsInterests,
} from '../controllers/settings.js';

const settingsRouter = express.Router();

// System settings
settingsRouter.get('/system/all', getSystemSettings);
settingsRouter.put('/system/name', updateSystemName);
settingsRouter.put('/system/abrev', updateSystemAbrev);
settingsRouter.put('/system/email', updateSystemEmail);
settingsRouter.put('/system/phone', updateSystemPhone);
settingsRouter.put('/system/pobox', updateSystemPobox);
settingsRouter.put('/system/motto', updateSystemMotto);
settingsRouter.put('/system/website', updateSystemWebsite);
settingsRouter.put('/system/izinaRyUbutore', updateSystemIzinaRyUbutore);
settingsRouter.put('/system/manager', updateSystemManager);
settingsRouter.put('/system/address', updateSystemAddress);

// Members settings
settingsRouter.put('/members/types', updateMembersTypes);
settingsRouter.put('/members/roles', updateMembersRoles);

// Savings settings
settingsRouter.put('/savings/monthlyDueDay', updateSavingsMonthlyDueDay);
settingsRouter.put('/savings/cotisation/amount', updateSavingsCotisationAmount);
settingsRouter.put('/savings/cotisation/delayPenaltyAmount', updateSavingsCotisationDelayPenaltyAmount);
settingsRouter.put('/savings/social/amount', updateSavingsSocialAmount);

// Expenses settings
settingsRouter.put('/expenses/types', updateExpensesTypes);

// Credits settings
settingsRouter.put('/credits/interests', updateCreditsInterests);

export default settingsRouter;