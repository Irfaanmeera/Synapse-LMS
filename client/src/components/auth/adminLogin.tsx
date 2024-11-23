import { FC, useState } from "react";
import { adminLogin } from "../../api/authentication";
import { userActions } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockClosedIcon } from "@heroicons/react/20/solid";

// Interface for Admin login data
interface AdminData {
  email: string;
  password: string;
}

const Signin: FC = () => {
  const [err, setErr] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UseForm hook for form validation and handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminData>({
    resolver: zodResolver(loginSchema),
  });

  // Function to handle form submission
  const submitData = async (data: AdminData) => {
    try {
      dispatch(userActions.setEmail(data.email));
      const response = await adminLogin(data);
      console.log("Login response:", response); // Log response

      dispatch(userActions.saveUser(response)); // Save user data
      navigate("/admin"); // Redirect to admin dashboard
    } catch (error: any) {
      setErr(error); // Set specific error message
      console.log("Error set:", error); // Log the error message set
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo section */}
        <div className=" text-2xl font-bold font-serif text-ultramarine flex justify-center">
          Synapse
        </div>

        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-slategray">
            Admin Login
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitData)} className="mt-8 space-y-8">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-px rounded-md shadow-sm">
            {/* Email Input */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email Address
              </label>
              <input
                id="email-address"
                {...register("email")}
                type="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-grey500 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email Address"
              />
              {errors.email && (
                <span className="text-red text-sm italic">
                  *{errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-grey500 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red text-sm italic">
                  *{errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign In
            </button>
          </div>

          {/* Error message display */}
          {err && (
            <p className="text-red text-opacity-20 text-sm">
              {err}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
