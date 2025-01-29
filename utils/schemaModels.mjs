import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  email: String,
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);
const UserModel = mongoose.model("User", UserSchema);
export { ItemModel, UserModel };
