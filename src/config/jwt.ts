import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"
const EXPRESS_IN = "2d" //Tiempo que permanecera el usuario logueado

export const generateToken = (payload: Object) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: EXPRESS_IN})
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}