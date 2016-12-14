import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
    name: String,
    status: String
});

TaskSchema.method({});


export default mongoose.model('Task', TaskSchema);
