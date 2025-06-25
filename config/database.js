import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGO_DB_URI,{
            dbName: "ChatApp",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Connected to database successfully")
        }).catch(err => {
            console.log("Some error occured while connecting to database")
        })
}
export default dbConnection