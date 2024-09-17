import mongoose, { Document, Model, Schema } from "mongoose";
import Encrypt from "../utils/comparePassword";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
    courses?: string[];
    comparePassword: (password: string) => Promise<boolean>;
}

const studentSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your name"],
        },
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            validate: {
                validator: function (value: string) {
                    return emailRegexPattern.test(value);
                },
                message: "Please enter a valide email",
            },
            unique: true,
        },
        mobile: {
            type: Number,
            required: [true, "Please Enter your mobile number"],
        },
        password: {
            type: String,
            required: [true, "Please Enter your password"],
            minlength: [6, "Password must be atleast 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        courses: [
            {
                courseId: String,
            },
        ],
    },
    { timestamps: true }
);

// Instance of the Encrypt class
const encrypt = new Encrypt();

// Hash password before saving
studentSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await encrypt.hashPassword(this.password); // Use the Encrypt class to hash the password
    next();
});

// Compare password
studentSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await encrypt.compare(enteredPassword, this.password); // Use the Encrypt class to compare passwords
};

const studentCollection: Model<IUser> = mongoose.model('Student', studentSchema);
export { studentCollection };
