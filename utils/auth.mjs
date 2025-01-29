import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();
const SECRET_KEY = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }

  const token = await req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.body.email = decoded.email;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default auth;
