import crypto from 'crypto';

export const generateStrongPassword = () => {
    return crypto.randomBytes(8).toString('hex');
};