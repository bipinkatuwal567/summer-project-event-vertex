import mongoose from "mongoose"

const connectDB = async () => {
   try {
    const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/event-management-system`)
    console.log(`MongoDb connected! DB HOST: ${connectionInstance.connection.host}`);
    

   } catch (error) {
    console.error("MongoDB Connection Error", error);
    process.exit(1);
   }
}

export default connectDB;