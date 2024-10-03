import { z, ZodType } from "zod";

interface SignupSchema {
    name: string;
    email: string;
    mobile: number;
    password: string;
    
  }

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{4,10}$/;

export const signupSchema: ZodType<SignupSchema> = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be less than 50 characters." })
    .refine((value) => value.trim() !== "", {
        message: "Name should not be empty",
      }
    ),
  
  email: z
    .string()
    .email({ message: "Invalid email address." }),
mobile: z
      .number()
      .min(1000000000, "Mobile should be 10 digits")
      .max(9999999999, "Mobile should be 10 digits"),
  
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password must be less than 100 characters." }),

//   confirmPassword: z
//     .string()
//     .min(6, { message: "Password confirmation must be at least 6 characters long." })
//     .max(100, { message: "Password confirmation must be less than 100 characters." })
//     .refine((value) => passwordRegex.test(value), {
//         message: "Password should contain letters and numbers",
//       }),

// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords must match.",
//   path: ["confirmPassword"],
});
