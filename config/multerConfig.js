import multer from "multer";
import fs from "fs";

// Define storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id } = req.params;
        const uploadDir = `uploads/images/members/member_${id}/`;

        // Ensure the directory exists
        fs.mkdirSync(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let filename;
        if (req.url.includes("edit-husband-photo")) {
            filename = `primary_${Date.now()}_${file.originalname}`;
        } else if (req.url.includes("edit-wife-photo")) {
            filename = `partner_${Date.now()}_${file.originalname}`;
        } else {
            return cb(new Error("Invalid upload type"), false);
        }

        cb(null, filename);
    },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
    }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter });

export default upload;