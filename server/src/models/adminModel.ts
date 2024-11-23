import mongoose, { Document, Model } from "mongoose";
import { IAdmin } from "../interfaces/Iadmin";
import bcrypt from "bcryptjs";  // Import bcrypt for password hashing

interface AdminModel extends Model<AdminDoc> {
  build(attrs: IAdmin): AdminDoc;
}

interface AdminDoc extends Document {
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,  // Ensure admin emails are unique
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // Remove password from JSON output for security
        delete ret.__v;
      },
    },
  }
);

// Pre-save hook to hash the password before saving it to the database
adminSchema.pre("save", async function (next) {
  const admin = this as AdminDoc;

  // Only hash the password if it has been modified (or is new)
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    admin.password = await bcrypt.hash(admin.password, salt); // Hash the password
  }

  next(); // Continue with the save
});

// Static method to create a new admin (using the build pattern)
adminSchema.statics.build = (admin: IAdmin) => {
  return new Admin(admin);
};

const Admin = mongoose.model<AdminDoc, AdminModel>("admin", adminSchema);

// Create admin automatically if none exists
const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
      // Create admin only if no admin exists in the collection
      const newAdmin = Admin.build({
        email: "irfaanmeera@gmail.com", // Default email, can be changed
        password: "admin123", // Default password, change this
      });
      await newAdmin.save();
      console.log("Admin created successfully");
    } 
  } catch (error) {
    console.error("Error checking/creating admin:", error);
  }
};

// Call this function in your app's initialization code to check for and create the admin
createAdmin();

export { Admin };
