import express from 'express';
import upload from "../config/multerConfig.js";

import { refreshToken } from '../middleware/refresh_token.js';
import { verifyToken } from '../middleware/verify_token.js';
import { getUsers, Register, Login, Logout, SendUserOPT, VerifyUserOTP, ResetUserPassword, recordAnnualSavings, editShares, editSocial, editWifeInfo, editHusbandInfo, editWifePhoto, editHusbandPhoto, distributeAnnualInterest, withdrawAnnualInterest, addMultipleShares, RemoveMember } from "../controllers/users.js";

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
usersRouter.post('/member/:id/shares', editShares);                          // Edit user's shares
usersRouter.post('/member/:id/cotisation', recordAnnualSavings);                  // Edit user's cotisation amount
usersRouter.post('/member/:id/social', editSocial);                          // Edit user's social amount
usersRouter.post('/member/:id/multiple-shares', addMultipleShares);          // Edit user's social amount

export default usersRouter;