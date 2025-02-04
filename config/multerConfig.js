import multer from 'multer';
import path from 'path';

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Different directories for husband and wife avatars
        const folder = file.fieldname === 'husbandAvatar' ? 'husbandAvatars' : 'wifeAvatars';
        cb(null, path.join('uploads', folder));
    },
    filename: (req, file, cb) => {
        // Rename the file to include a timestamp for uniqueness
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer instance
const upload = multer({ storage });

export default upload;