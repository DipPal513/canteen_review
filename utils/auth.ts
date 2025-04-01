import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (email: string): string => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
    return decoded.email;
  } catch (error: any) {
    return null;
  }
};
