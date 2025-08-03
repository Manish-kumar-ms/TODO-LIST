import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskModel',
        }],
    },
    { timestamps: true }
);

const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;