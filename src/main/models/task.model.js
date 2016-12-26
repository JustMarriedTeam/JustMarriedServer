import mongoose from "mongoose";
import pick from 'lodash/pick'


const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String
});

TaskSchema.method({
    toJSON: function() {
        return pick(this.toObject(), ['name', 'status']);
    }
});


export default mongoose.model('Task', TaskSchema);
