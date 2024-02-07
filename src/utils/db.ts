import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";
import User from "../models/User";

dotenvConfig({ path: ".env" });

export const uri = process.env.MONGO_DB_URI as string;
mongoose.set("strictQuery", true);

export const connectToDb = async () => {
  try {
    console.log("🟠 Connecting to MongoDB...");
    await mongoose
      .connect(uri, { dbName: "user-auth" })
      .then(() => console.log("🟢 Success connecting to MongoDB"));
    const user = new User({
      email: "test@userauth.com",
      password: "testPassword@1253",
    });
    return mongoose.connection;
  } catch (err) {
    console.log("🔴 An error occured while connecting to MongoDb: ", err);
  } finally {
    // await client.close();
  }
};
