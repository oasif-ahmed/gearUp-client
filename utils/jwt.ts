import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const decodeToken = (token: string, secret: string) => {
    try {
        const decodedToken = jwt.verify(token, secret, { 
            algorithms: ['HS256'] 
        });// token valid holee token theke payload return kore
        return {
            success: true,
            data: decodedToken
        };
    } catch (error: any) {
        console.log("Token Verification Failed!", error);
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    verifyToken: decodeToken
}