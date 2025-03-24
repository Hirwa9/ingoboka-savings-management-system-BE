import express from 'express';
import upload from "../config/multerConfig.js";

import { refreshToken } from '../middleware/refresh_token.js';
import { verifyToken } from '../middleware/verify_token.js';
import { getUsers, Register, Login, Logout, SendUserOPT, VerifyUserOTP, ResetUserPassword, recordAnnualSavings, editShares, recordSocialSavings, editWifeInfo, editHusbandInfo, editWifePhoto, editHusbandPhoto, distributeAnnualInterest, withdrawAnnualInterest, addMultipleShares, RemoveMember, reverseAnnualSavings, editSocialSavings, deleteSocialSavings } from "../controllers/users.js";

const usersRouter = express.Router();

// usersRouter.get('/users', verifyToken, getUsers);             // Get users
usersRouter.get('/users', getUsers);                             // Get users
usersRouter.post('/users/register', Register);                   // Register a user
usersRouter.post('/login', Login);                               // Login a user
usersRouter.get('/token', refreshToken);                         // Get token
usersRouter.get('/verifyToken', verifyToken);                    // Verify token
usersRouter.post('/logout', Logout);                           // Logout a user

// Edit user info
usersRouter.post('/user/:id/edit-husband-photo',
    upload.single("file"),
    editHusbandPhoto
);  // Edit husband photo
usersRouter.post('/user/:id/edit-wife-photo',
    upload.single("file"),
    editWifePhoto
);  // Edit wife photo
usersRouter.post('/user/:id/edit-wife-photo', editWifePhoto);                // Edit wife photo
usersRouter.post('/user/:id/edit-husband-info', editHusbandInfo);            // Edit husband info
usersRouter.post('/user/:id/edit-wife-info', editWifeInfo);                  // Edit wife info
usersRouter.post('/user/remove', RemoveMember);                              // Remove a user

// Savings
usersRouter.post('/member/:id/shares/edit', editShares);                          // Edit user's shares
usersRouter.post('/member/:id/cotisation', recordAnnualSavings);             // Record user's cotisation savings
usersRouter.post('/member/:id/cotisation/reverse', reverseAnnualSavings);    // Reverse user's cotisation savings
usersRouter.post('/member/:id/social', recordSocialSavings);                 // Record user's social savings
usersRouter.post('/member/:id/social/edit', editSocialSavings);              // Edit user's social savings
usersRouter.post('/member/:id/social/delete', deleteSocialSavings);          // Delete user's social savings
usersRouter.post('/member/:id/multiple-shares', addMultipleShares);          // Record user's multiple shares savings

export default usersRouter;