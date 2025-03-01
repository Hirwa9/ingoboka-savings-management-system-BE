import User from "../models/user_model.js";
import Record from "../models/record_model.js";
import Loan from "../models/loan_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";  // Nodemailer sendEmail utility
import { generateStrongPassword } from "../utils/generateStrongPassword.js";
import { Op } from "sequelize";
import { allFigures } from "./figures.js";
import { allLoans } from "./loans.js";
import { allSystemSettings } from "./settings.js";

// All users
export const allUsers = async () => {
    return await User.findAll();
}

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await allUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

// Register a user
export const Register = async (req, res) => {
    try {
        let {
            role,
            username,
            husbandFirstName,
            husbandLastName,
            husbandPhone,
            husbandEmail,
            wifeFirstName,
            wifeLastName,
            wifePhone,
            wifeEmail,
            password,
            autoGeneratePassword,
        } = req.body;

        // Handle invalid/empty or weak password
        if (!autoGeneratePassword) {
            if (!password || password === '') {
                return res.status(400).json({ message: "Password is required" });
            }

            // Define regex patterns for password validation
            const minLength = /.{8,}/; // At least 8 characters
            const hasUppercase = /[A-Z]/; // At least one uppercase letter
            const hasLowercase = /[a-z]/; // At least one lowercase letter
            // const hasNumber = /[0-9]/; // At least one digit
            // const hasSpecialChar = /[!@#$%^&*]/; // At least one special character

            // Check password strength
            if (password.includes("password")) {
                return res.status(400).json({ message: "Password should not be or include the keyword 'password'" });
            }
            if (!minLength.test(password)) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            if (!hasUppercase.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
            }
            if (!hasLowercase.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
            }
            // if (!hasNumber.test(password)) {
            //     return res.status(400).json({ message: "Password must contain at least one number" });
            // }
            // if (!hasSpecialChar.test(password)) {
            //     return res.status(400).json({ message: "Password must contain at least one special character (!@#$%^&*)" });
            // }
        }

        // Check if user exists using either husband's email or wife's email
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { husbandEmail: husbandEmail },
                    { husbandEmail: wifeEmail },
                    { wifeEmail: wifeEmail },
                    { wifeEmail: husbandEmail },
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with the same email already exists" });
        }

        // Check if user exists using the same username
        const existingUserName = await User.findOne({ where: { username: username } });
        if (existingUserName) {
            return res.status(400).json({ message: `User with this username "${username}" already exists` });
        }

        // Check if user exists using the same phone number
        const existingPhoneNumber = await User.findOne({
            where: {
                [Op.or]: [
                    { husbandPhone: husbandPhone },
                    { husbandPhone: wifePhone },
                    { wifePhone: wifePhone },
                    { wifePhone: husbandPhone },
                ]
            }
        });

        if (existingPhoneNumber) {
            return res.status(400).json({ message: "User with the same phone number already exists" });
        }

        // Set wife/partner data to null if not provided
        wifeFirstName = wifeFirstName === '' ? null : wifeFirstName;
        wifeLastName = wifeLastName === '' ? null : wifeLastName;
        wifePhone = wifePhone === '' ? null : wifePhone;
        wifeEmail = wifeEmail === '' ? null : wifeEmail;

        const finalPassword = autoGeneratePassword ? generateStrongPassword() : password;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(finalPassword, salt);

        // Create a member
        const newUser = await User.create({
            role,
            username,
            husbandFirstName,
            husbandLastName,
            husbandPhone,
            husbandEmail,
            wifeFirstName,
            wifeLastName,
            wifePhone,
            wifeEmail,
            password: hashedPassword,
        });

        // Create default records for the added member in (Loans table)
        await Loan.create({
            memberId: newUser.id,
        });

        // Notify the new member
        //     await sendEmail(
        //         husbandEmail,
        //         'Welcome to Ikimina Ingoboka!',
        //         `
        // <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        //     <h2 style="color: #4CAF50;">Welcome to Ikimina Ingoboka!</h2>
        //     <p>Dear ${husbandFirstName},</p>
        //     <p>
        //         We are delighted to have you join <strong>Ikimina Ingoboka</strong>, a community committed to mutual savings 
        //         and financial support. Your membership is now active, and we look forward to helping you achieve your financial goals.
        //     </p>
        //     <p>
        //         Below are your account details:
        //     </p>
        //     <ul style="list-style: none; padding: 0;">
        //         <li><strong>Email:</strong> ${husbandEmail}</li>
        //         <li><strong>Password:</strong> ${finalPassword}</li>
        //     </ul>
        //     <p>
        //         Please keep this information secure. You can log in to your account at any time to manage your savings, view your contributions, and stay up-to-date with the group's activities.
        //     </p>
        //     <p>
        //         If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@ikiminaingoboka.com">support@ikiminaingoboka.com</a>. 
        //         We are here to support you every step of the way.
        //     </p>
        //     <p style="margin-top: 20px;">
        //         Warm regards,<br/>
        //         <strong>Ikimina Ingoboka Team</strong>
        //     </p>
        // </div>
        // `
        //     );

        return res.status(201).json({ message: `User ${newUser.username} is registered successfully`, userId: newUser.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Registration failed. Please try again later.', error: error.message });
    }
};

// Login
export const Login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (emailOrUsername.toLowerCase() === 'admin') {
            // Login as an admin
            const user = await User.findOne({ where: { role: 'accountant' } });

            if (!user) return res.status(404).json({ message: 'Invalid credentials. Please try again.' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid credentials. Please try again." });

            const { id, name, email, type } = user;

            const accessToken = jwt.sign(
                { id, name, email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '12h' }
            );

            const refreshToken = jwt.sign(
                { id, name, email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            );

            await User.update({ token: refreshToken }, { where: { id } });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ accessToken, user: { type, id } });
        } else {
            // Login as a user
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { husbandEmail: emailOrUsername },
                        { username: emailOrUsername }
                    ]
                }
            });

            if (!user) return res.status(404).json({ message: 'Invalid credentials. Please try again.' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid credentials. Please try again." });

            const { id, name, email, type } = user;

            const accessToken = jwt.sign(
                { id, name, email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '12h' }
            );

            const refreshToken = jwt.sign(
                { id, name, email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            );

            await User.update({ token: refreshToken }, { where: { id } });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ accessToken, user: { type, id } });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed. Please try again later", error: error });
    }
};

// Logout
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Extract from cookies

    if (!refreshToken) return res.status(204).json({ message: "No token found" });

    const user = await User.findOne({ where: { token: refreshToken } });
    if (!user) return res.status(204).json({ message: "User not found" });

    // Remove refreshToken from DB
    await User.update({ token: null }, { where: { id: user.id } });

    // Clear cookies
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "Lax", secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Lax", secure: true });

    return res.status(200).json({ message: "You're signed out" });
};

// Remove Member
export const RemoveMember = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { husbandEmail: email } });
        const figures = await allFigures();
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!figures) return res.status(404).json({ error: 'Figures record not found' });

        const { cotisation, social } = user;
        const totalContributions = cotisation + Number(social);

        const loan = await Loan.findOne({
            where: {
                memberId: user.id,
                loanPending: { [Op.gt]: 0 }
            }
        });

        const defaultAnnualSharesValue = [...Array(12)].map((_, i) => ({
            month: new Date(0, i).toLocaleString('en', { month: 'long' }),
            paid: false,
            hasPenalties: false
        }));

        let responseMessage = "";
        let retainedBalance = 0;

        if (loan) {
            if (totalContributions >= loan.loanPending) {
                retainedBalance = totalContributions - loan.loanPending;

                await loan.update({
                    loanPending: 0,
                    loanPaid: loan.loanTaken,
                    interestPending: 0,
                    interestPaid: loan.interestTaken,
                    tranchesPending: 0,
                    tranchesPaid: loan.tranchesTaken
                });
                await figures.increment('balance', { by: retainedBalance });

                await user.update({
                    status: 'removed',
                    shares: 0,
                    annualShares: JSON.stringify(defaultAnnualSharesValue),
                    cotisation: 0,
                    social: 0
                });

                responseMessage = `Member removed successfully. Loan settled. Retained ${retainedBalance.toLocaleString()} RWF in balance.`;
            } else {
                await loan.update({
                    loanPending: loan.loanPending - totalContributions,
                    loanPaid: loan.loanPaid + totalContributions
                });

                await user.update({
                    status: 'inactive',
                    shares: 0,
                    annualShares: JSON.stringify(defaultAnnualSharesValue),
                    cotisation: 0,
                    social: 0
                });
                await figures.increment('balance', { by: totalContributions });

                responseMessage = `Member set to inactive. Contributions of ${totalContributions.toLocaleString()} RWF used to settle loan.`;
            }
        } else {
            await user.update({
                status: 'removed',
                shares: 0,
                annualShares: JSON.stringify(defaultAnnualSharesValue),
                cotisation: 0,
                social: 0
            });

            responseMessage = "Member removed successfully. No pending loans found.";
        }

        return res.status(200).json({ message: responseMessage });
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

/**
 * Reset password
 */

// OTP storage (you may want to store this in the database instead of memory in production)
const otpStore = {};


// Send OTP digits
export const SendUserOPT = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { husbandEmail: email } });

        // Prevent exposing whether the user exists or not
        if (!user) {
            return res.status(200).json({ message: "If this email is registered, you will receive a reset code." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        // Store the OTP and expiration in the database
        user.otp = otp;
        user.otpExpiration = new Date(expiration);
        await user.save();

        try {
            // Send OTP email
            const emailContent = `Hello ${user.name},\n\nYour password reset code is: ${otp}. It expires in 15 minutes.`;
            await sendEmail(user.email, 'Password Reset Code', '', emailContent);

            // Respond only if the email was successfully sent
            res.status(200).json({ message: "If this email is registered, you will receive a reset code." });
        } catch (sendEmailError) {
            // Handle the error specifically from the sendEmail function
            console.error("Failed to send email:", sendEmailError);
            res.status(500).json({ message: "An error occurred while sending the reset code. Please try again." });
        }

    } catch (error) {
        // Handle any other errors
        res.status(500).json({ message: "Failed to send OTP. Please try again.", error: error.message });
    }
};

// Verify OTP
export const VerifyUserOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ where: { husbandEmail: email } });

        if (!user) {
            return res.status(400).json({ message: "Invalid request. Please try again." });
        }

        // Check if OTP exists and is not expired
        if (!user.otp || user.otp !== otp || new Date() > user.otpExpiration) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // If OTP is valid, respond success without resetting the password yet
        res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });

    } catch (error) {
        res.status(500).json({ message: "OTP verification failed. Please try again.", error: error.message });
    }
};

// console.log('alain: ', await bcrypt.hash('alain', 10));

// Reset Password
export const ResetUserPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { husbandEmail: email } });

        if (!user) {
            return res.status(400).json({ message: "Invalid request. Please try again." });
        }

        // Hash the new password (assuming bcrypt is used)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        res.status(200).json({ message: "Pasword reset successfully. You can login with your new credentials." });
    } catch (error) {
        res.status(500).json({ message: "Password reset failed. Please try again.", error: error.message });
    }
};

// Edit husband info
export const editHusbandInfo = async (req, res) => {
    const { id } = req.params;
    const { role, username, husbandFirstName, husbandLastName, husbandPhone, husbandEmail } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update user's info
        user.role = role;
        user.username = username;
        user.husbandFirstName = husbandFirstName;
        user.husbandLastName = husbandLastName;
        user.husbandPhone = husbandPhone;
        user.husbandEmail = husbandEmail;
        await user.save();

        res.status(200).json({ message: "Member info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit husband info
export const editHusbandPhoto = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Save the file URL in the database
        user.husbandAvatar = `/uploads/husbandAvatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({ message: "Husband avatar updated successfully", url: user.husbandAvatar });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit wife info
export const editWifeInfo = async (req, res) => {
    const { id } = req.params;
    const { role, username, wifeFirstName, wifeLastName, wifePhone, wifeEmail } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update user's info
        user.role = role;
        user.username = username;
        user.wifeFirstName = wifeFirstName;
        user.wifeLastName = wifeLastName;
        user.wifePhone = wifePhone;
        user.wifeEmail = wifeEmail;
        await user.save();

        res.status(200).json({ message: "Member info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit husband info
export const editWifePhoto = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Save the file URL in the database
        user.husbandAvatar = `/uploads/wifeAvatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({ message: "Husband avatar updated successfully", url: user.husbandAvatar });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit Shares
export const editShares = async (req, res) => {
    const { id } = req.params;
    const { shares, comment } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update user's share amount
        user.shares = shares;
        await user.save();

        res.status(200).json({ message: "Shares updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit cotisation
export const recordAnnualSavings = async (req, res) => {
    const { id } = req.params;
    const { savings, applyDelayPenalties, comment } = req.body;

    try {
        const user = await User.findByPk(id);
        const figures = await allFigures();
        const settings = await allSystemSettings();

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!figures) return res.status(404).json({ error: 'Figures record not found' });
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const unitShareValue = JSON.parse(
            settings.settingsData)?.savings.types
            .find(t => t.type === 'cotisation')?.amount

        const cotisationPenalty = JSON.parse(
            settings.settingsData)?.savings.types
            .find(t => t.type === 'cotisation')?.delayPenaltyAmount

        // Parse and update the user's annualShares
        let annualShares = JSON.parse(user.annualShares) || [];
        let totalSavingAmount = 0;

        // Process each selected month
        savings.forEach((month) => {
            const monthRecord = annualShares.find((m) => m.month === month);

            if (monthRecord && !monthRecord.paid) {
                const today = new Date();
                const currentYear = today.getFullYear();
                const monthIndex = new Date(`${month} 1, ${currentYear}`).getMonth(); // Get index from month name
                const month10thDate = new Date(currentYear, monthIndex, 10); // 10th of the month
                const isLate = (today > month10thDate && applyDelayPenalties);

                // Update the month record
                monthRecord.paid = true;
                monthRecord.hasPenalties = isLate ? true : false;

                // Add saving amount
                totalSavingAmount += isLate ? (unitShareValue + cotisationPenalty) : unitShareValue; // Apply penalty if late
            }
        });

        // Update user cotisation, annualShares, and total shares
        user.cotisation = Number(user.cotisation) + totalSavingAmount;
        user.annualShares = annualShares; // Save the updated JSON object
        user.shares += savings.length; // Add new shares to the total shares
        await user.save();

        await figures.increment({ balance: Number(totalSavingAmount) });

        // Create transaction record in the records table
        await Record.create({
            memberId: id,
            recordType: 'deposit',
            recordAmount: totalSavingAmount,
            comment,
        });

        // Send email notification
        const emailContent = `
            Hello ${user.husbandFirstName},
            
            Your cotisation amount on IKIMINA INGOBOKA has been updated successfully.
            Added amount: ${totalSavingAmount.toLocaleString()} RWF
            Current amount: ${user.cotisation.toLocaleString()} RWF
            You can login to your account to see full details.
        `;
        // Uncomment these lines to send email
        // await sendEmail(user.email, 'Ingoboka Cotisation Amount Update', '', emailContent);
        // await sendEmail('hirwawilly9@gmail.com', 'Ingoboka Cotisation Amount Update', '', emailContent);

        res.status(200).json({ message: `Savings updated successfully for ${user.username}.` });
    } catch (error) {
        console.error("Error updating cotisation:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Edit Social
export const editSocial = async (req, res) => {
    const { id } = req.params;
    const { savingAmount, comment } = req.body;

    try {
        const user = await User.findByPk(id);
        const figures = await allFigures();
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!figures) return res.status(404).json({ error: 'Figures record not found' });

        // Update user's social amount
        user.social = Number(user.social) + Number(savingAmount);
        await user.save();

        await figures.increment('balance', { by: Number(savingAmount) });

        // Create transaction record in the records table
        await Record.create({
            memberId: id,
            recordType: 'deposit',
            recordAmount: savingAmount,
            comment,
        });

        // Send email notification
        const emailContent = `
            Hello ${user.name},
            
            Your social currency amount on IKIMINA INGOBOKA has been updated successfully.
            Added amount: ${savingAmount} RWF
            Current amount: ${user.social} RWF
        `;
        // await sendEmail(user.email, 'Ingoboka Social Amount Update', '',emailContent);
        // await sendEmail('hirwawilly9@gmail.com', 'Ingoboka Social Amount Update', '',emailContent);

        res.status(200).json({ message: "Social updated successfully." });
    } catch (error) {
        console.error("Error updating social:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Add multiple shares
// export const addMultipleShares = async (req, res) => {
//     const { id } = req.params;
//     const { newMember, progressiveShares, newMemberSocial, newMemberInterest, comment } = req.body;

//     try {
//         const users = await allUsers();
//         const user = users.find(u => u.id == id);
//         const figures = await allFigures();
//         const loans = await allLoans();

//         if (!user) return res.status(404).json({ error: 'User not found' });
//         if (!figures) return res.status(404).json({ error: 'Figures record not found' });
//         if (!loans) return res.status(404).json({ error: 'Loans records not found' });

//         const shareMultiples = progressiveShares * 20000;

//         user.shares += Number(progressiveShares);
//         user.cotisation += shareMultiples;

//         // Ensure annualShares is an array
//         let annualShares = typeof user.annualShares === 'string'
//             ? JSON.parse(user.annualShares)
//             : user.annualShares;

//         let remainingShares = Number(progressiveShares);
//         annualShares = annualShares.map((month) => {
//             if (!month.paid && remainingShares > 0) {
//                 month.paid = true;
//                 remainingShares--;
//             }
//             return month;
//         });

//         user.annualShares = annualShares;
//         user.progressiveShares += remainingShares;

//         // Handle new member calculations
//         if (newMember) {
//             const userLoan = loans.find(ln => ln.memberId === user.id);

//             // Calculate average initial interest
//             const totalInitialInterest = users.reduce((sum, usr) => sum + Number(usr.initialInterest || 0), 0);
//             const averageInitialInterest = users.length > 0 ? totalInitialInterest / (users.length - 1) : 0;

//             user.social = Number(user.social) + Number(newMemberSocial);
//             user.initialInterest = Number(averageInitialInterest);
//             userLoan.interestPaid += Number(newMemberInterest) - averageInitialInterest;

//             await userLoan.save();
//             await figures.increment({
//                 balance: Number(newMemberSocial) + Number(newMemberInterest)
//             });
//         }

//         await user.save();
//         await figures.increment({ balance: shareMultiples });

//         // Create transaction record
//         if (progressiveShares && progressiveShares > 0) {
//             await Record.create({
//                 memberId: id,
//                 recordType: 'deposit',
//                 recordSecondaryType: 'Multiple shares record',
//                 recordAmount: shareMultiples,
//                 comment,
//             });
//         }

//         // Send email notification
//         const emailContent = `
//             Hello ${user.husbandFirstName},

//             Your multiple shares on IKIMINA INGOBOKA have been added successfully.
//             Added shares: ${progressiveShares}
//             Respective amount: ${(progressiveShares * 20000).toLocaleString()} RWF
//             You can login to your account to see full details.
//         `;
//         // Uncomment to enable email sending
//         // await sendEmail(user.email, 'Ingoboka Multiple Shares Update', '', emailContent);
//         // await sendEmail('hirwawilly9@gmail.com', 'Ingoboka Multiple Shares Update', '', emailContent);

//         res.status(200).json({ message: `${progressiveShares} multiple shares added successfully.` });
//     } catch (error) {
//         console.error("Error updating multiple shares:", error);
//         res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
//     }
// };

export const addMultipleShares = async (req, res) => {
    const { id } = req.params;
    const { newMember, progressiveShares, newMemberSocial, newMemberInterest, comment } = req.body;

    try {
        const users = await allUsers();
        const user = users.find(u => u.id == id);
        const figures = await allFigures();
        const loans = await allLoans();
        const settings = await allSystemSettings();

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!figures) return res.status(404).json({ error: 'Figures record not found' });
        if (!loans) return res.status(404).json({ error: 'Loans records not found' });
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const unitShareValue = JSON.parse(
            settings.settingsData)?.savings.types
            .find(t => t.type === 'cotisation')?.amount

        const shareMultiples = progressiveShares * unitShareValue;

        user.shares += Number(progressiveShares);
        user.cotisation += shareMultiples;
        user.progressiveShares += Number(progressiveShares);

        // Handle new member calculations
        if (newMember) {
            const userLoan = loans.find(ln => ln.memberId === user.id);

            // Calculate average initial interest
            const totalInitialInterest = users.reduce((sum, usr) => sum + Number(usr.initialInterest || 0), 0);
            const averageInitialInterest = users.length > 0 ? totalInitialInterest / (users.length - 1) : 0;

            user.social = Number(user.social) + Number(newMemberSocial);

            // Check if the interest can be stored separately 
            // to avoid negative values
            const interestDiff = Number(newMemberInterest) - averageInitialInterest;
            if (interestDiff > 0) {
                user.initialInterest = Number(averageInitialInterest);
                userLoan.interestPaid += interestDiff;
            } else {
                user.initialInterest = Number(newMemberInterest);
            }

            await userLoan.save();
            await figures.increment({
                balance: Number(newMemberSocial) + Number(newMemberInterest)
            });
        }

        await user.save();
        await figures.increment({ balance: shareMultiples });

        // Create transaction record
        if (progressiveShares && progressiveShares > 0) {
            await Record.create({
                memberId: id,
                recordType: 'deposit',
                recordSecondaryType: 'Multiple shares record',
                recordAmount: shareMultiples,
                comment,
            });
        }

        // Send email notification
        const emailContent = `
            Hello ${user.husbandFirstName},

            Your multiple shares on IKIMINA INGOBOKA have been added successfully.
            Added shares: ${progressiveShares}
            Respective amount: ${(progressiveShares * unitShareValue).toLocaleString()} RWF
            You can login to your account to see full details.
        `;
        // Uncomment to enable email sending
        // await sendEmail(user.email, 'Ingoboka Multiple Shares Update', '', emailContent);
        // await sendEmail('hirwawilly9@gmail.com', 'Ingoboka Multiple Shares Update', '', emailContent);

        res.status(200).json({ message: `${progressiveShares} multiple shares added successfully.` });
    } catch (error) {
        console.error("Error updating multiple shares:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Interest distribution
export const distributeAnnualInterest = async (req, res) => {
    try {
        const users = await allUsers();
        const figures = await allFigures();
        const loans = await allLoans();
        const settings = await allSystemSettings();

        if (!users || users.length === 0) return res.status(404).json({ error: 'No users found' });
        if (!figures) return res.status(404).json({ error: 'Figures records not found. They are essential for this to go through.' });
        if (!loans) return res.status(404).json({ error: 'Credit records not found. They are essential for this to go through.' });
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const unitShareValue = JSON.parse(
            settings.settingsData)?.savings.types
            .find(t => t.type === 'cotisation')?.amount

        const shareMultiples = progressiveShares * unitShareValue;

        const totalActiveShares = users.reduce((sum, item) => {
            const progressiveShares = item.progressiveShares;
            const paidAnnualShares = JSON.parse(item.annualShares).filter(share => share.paid).length;
            return sum + progressiveShares + paidAnnualShares;
        }, 0);

        const totalPaidInterest = loans.reduce((sum, loan) => sum + Number(loan.interestPaid), 0);
        const currentPeriodPaidInterest = totalPaidInterest
            - users.reduce((sum, m) => sum + Number(m.distributedInterestPaid), 0);

        let totalDistributedAmount = 0;

        // Process each user
        for (const user of users) {
            const userLoan = loans.find(ln => ln.memberId === user.id);
            if (!userLoan) res.status(404).json({ error: `Could not find ${user.username}'s loan status to determine their paid interest` });

            const progressiveShares = user.progressiveShares;
            const paidAnnualShares = JSON.parse(user.annualShares).filter(share => share.paid).length;
            const activeShares = progressiveShares + paidAnnualShares;
            const sharesProportion = totalActiveShares > 0 ? activeShares / totalActiveShares : 0;

            // Compute interest
            const totalInterest = (currentPeriodPaidInterest * sharesProportion) + Number(user.initialInterest);

            // Extract multiple shares and interest amounts
            const interestReceivable = Math.floor(totalInterest / unitShareValue) * unitShareValue;
            const sharesReceivable = interestReceivable / unitShareValue;
            const interestRemains = totalInterest - interestReceivable;

            // Update user
            user.shares += sharesReceivable;
            user.cotisation += interestReceivable;
            user.initialInterest = interestRemains;
            user.progressiveShares = 0; // Reset progressiveShares for the new year
            user.distributedInterestPaid = userLoan.interestPaid || 0;
            user.annualShares = JSON.parse(user.annualShares)
                .map(share => ({ ...share, paid: false, hasPenalties: false }));

            await user.save();

            totalDistributedAmount += interestReceivable;
        }

        // Update Figures record
        await figures.increment('distributedInterest', { by: Number(totalDistributedAmount) });

        res.status(200).json({
            message: `Annual distribution completed. Total distributed: ${totalDistributedAmount.toLocaleString()} RWF.`,
        });
    } catch (error) {
        console.error("Error in annual interest distribution:", error);
        res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
    }
};

// Interest withdraw
export const withdrawAnnualInterest = async (req, res) => {
    try {
        const users = await allUsers();
        const figures = await allFigures();
        const loans = await allLoans();
        const settings = await allSystemSettings();

        if (!users || users.length === 0) return res.status(404).json({ error: 'No users found' });
        if (!figures) return res.status(404).json({ error: 'Figures records not found. They are essential for this to go through.' });
        if (!loans) return res.status(404).json({ error: 'Credit records not found. They are essential for this to go through.' });
        if (!settings) return res.status(404).json({ message: 'System settings not found' });

        const unitShareValue = JSON.parse(
            settings.settingsData)?.savings.types
            .find(t => t.type === 'cotisation')?.amount

        const shareMultiples = progressiveShares * unitShareValue;

        const totalActiveShares = users.reduce((sum, item) => {
            const progressiveShares = item.progressiveShares;
            const paidAnnualShares = JSON.parse(item.annualShares).filter(share => share.paid).length;
            return sum + progressiveShares + paidAnnualShares;
        }, 0);

        const totalPaidInterest = loans.reduce((sum, loan) => sum + Number(loan.interestPaid), 0);
        const currentPeriodPaidInterest = totalPaidInterest
            - users.reduce((sum, m) => sum + Number(m.distributedInterestPaid), 0);

        let totalWithdrawnAmount = 0;

        // Calculate total withdrawal amount before modifying any table
        for (const user of users) {
            const userLoan = await Loan.findOne({ where: { memberId: user.id } });
            if (!userLoan) return res.status(404).json({ error: `Could not find ${user.username}'s loan status to determine their paid interest` });

            const progressiveShares = user.progressiveShares;
            const paidAnnualShares = JSON.parse(user.annualShares).filter(share => share.paid).length;
            const activeShares = progressiveShares + paidAnnualShares;
            const sharesProportion = totalActiveShares > 0 ? activeShares / totalActiveShares : 0;

            // Compute interest
            const totalInterest = (currentPeriodPaidInterest * sharesProportion) + Number(user.initialInterest);

            // Extract interest that can be withdrawn (rounded down to nearest 20,000)
            const interestReceivable = Math.floor(totalInterest / unitShareValue) * unitShareValue;
            totalWithdrawnAmount += interestReceivable;
        }

        // Check if balance is sufficient for withdrawal
        if (figures.balance < totalWithdrawnAmount) {
            return res.status(400).json({ error: 'Insufficient balance to process the withdrawal.' });
        }

        // Process each user since balance is sufficient
        for (const user of users) {
            const userLoan = await Loan.findOne({ where: { memberId: user.id } });

            const progressiveShares = user.progressiveShares;
            const paidAnnualShares = JSON.parse(user.annualShares).filter(share => share.paid).length;
            const activeShares = progressiveShares + paidAnnualShares;
            const sharesProportion = totalActiveShares > 0 ? activeShares / totalActiveShares : 0;

            // Compute interest
            const totalInterest = (currentPeriodPaidInterest * sharesProportion) + Number(user.initialInterest);

            // Extract interest that remains amount
            const interestReceivable = Math.floor(totalInterest / unitShareValue) * unitShareValue;
            const interestRemains = totalInterest - interestReceivable;

            // Update user
            user.initialInterest = interestRemains;
            user.progressiveShares = 0; // Reset progressiveShares for the new year
            user.distributedInterestPaid = userLoan.interestPaid || 0;
            user.annualShares = JSON.parse(user.annualShares)
                .map(share => ({ ...share, paid: false, hasPenalties: false }));

            await user.save();
        }

        // Deduct total withdrawn amount from balance
        await figures.decrement('balance', { by: Number(totalWithdrawnAmount) });
        await figures.increment('distributedInterest', { by: Number(totalWithdrawnAmount) });

        res.status(200).json({ message: 'Annual interest withdrawn successfully', totalWithdrawnAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};