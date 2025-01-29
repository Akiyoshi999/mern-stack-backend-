import express from "express";
import env from "dotenv";
import connectDB from "./utils/database.mjs";
import auth from "./utils/auth.mjs";
import jwt from "jsonwebtoken";
import { ItemModel, UserModel } from "./utils/schemaModels.mjs";
env.config();

const SECRET_KEY = process.env.SECRET_KEY || "exmaple-secret";
const PORT = process.env.PORT || 5050;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ITEM function
// Create Item
app.post("/item/create", auth, async (req, res) => {
  try {
    await connectDB();
    console.log(req.body);
    await ItemModel.create(req.body);
    return res.status(200).json("Item create success");
  } catch (err) {
    return res.status(400).json("Item create failed");
  }
});
// Read All Item
app.get("/", async (req, res) => {
  try {
    await connectDB();
    const allItems = await ItemModel.find();
    return res
      .status(200)
      .json({ message: "All Item read successed", allItems: allItems });
  } catch (err) {
    return res.status(400).json("Item read failed");
  }
});
// Read Single Item
app.get("/item/:id", async (req, res) => {
  try {
    await connectDB();
    const singleItem = await ItemModel.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "Single Item read successed", singleItem: singleItem });
  } catch (err) {
    return res.status(400).json({ message: "Item read failed" });
  }
});
// Update Item
app.put("/item/update/:id", auth, async (req, res) => {
  try {
    await connectDB();
    const singleItem = await ItemModel.findById(req.params.id);
    if (singleItem.email !== req.body.email) {
      throw new Error();
    }
    await ItemModel.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ message: "Item update success" });
  } catch (err) {
    return res.status(400).json({ message: "Item update failed" });
  }
});
// Delete Item
app.delete("/item/delete/:id", auth, async (req, res) => {
  try {
    await connectDB();
    const targetItem = await ItemModel.findById(req.params.id);
    if (targetItem.email !== req.body.email) {
      throw new Error();
    }
    await ItemModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Item delete success" });
  } catch (err) {
    return res.status(400).json({ message: "Item delete failed" });
  }
});

// USER function
// Register User
app.post("/user/register", async (req, res) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({ message: "User register success" });
  } catch (err) {
    return res.status(400).json({ message: "User register failed" });
  }
});
// Login User
app.post("/user/login", async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password === req.body.password) {
      // passworc success
      const payload = {
        email: req.body.email,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
      return res.status(200).json({ message: "User login success", token });
    } else {
      return res.status(400).json({ message: "Password is incorrect" });
    }
  } catch (err) {
    return res.status(400).json({ message: "User login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
