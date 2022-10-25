import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    const token = req.headers.accesstoken;
    if (!token) return res.status(401).send({ message: "Access denied" });
    try {
        const verified = await jwt.verify(token, process.env.SECRET_KEY)
        req.body.user = verified;
        next();
    }
    catch (err) {
        res.status(401).send({ message: err })
    }
}