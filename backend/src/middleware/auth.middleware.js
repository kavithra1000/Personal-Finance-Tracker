import jwt from "jsonwebtoken";
import User  from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        //verifies and returns the data inside the token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}