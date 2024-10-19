// IMPORTS
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CustomInput from "./CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../redux/userSlice";
import { RootState } from "../../../redux/store";
import { updateUser } from "../../../api/studentApi";
import { toast } from "react-hot-toast";

// Manual validation rules
const validateName = (name: string) => {
  if (!name.trim()) {
    return "Name should not be empty";
  }
  if (!/^[A-Za-z ]+$/.test(name)) {
    return "Name should only contain alphabets and spaces";
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.length > 50) {
    return "Name must be less than 50 characters";
  }
  return "";
};


const validateMobile = (mobile: string) => {
  // Check if the number starts with a "+"
  // if (!mobile.startsWith("+")) {
  //   return "Mobile number should start with a '+' followed by the country code";
  // }

  // Check if the mobile number (excluding the '+') contains only digits
  // const digitsOnly = mobile.slice(1); // Remove the '+' for digit check
  if (!/^\d+$/.test(mobile)) {
    return "Mobile number should contain only numbers after the '+'";
  }

  // Check if the length of the mobile number (including the country code) is correct
  if (mobile.length !== 12) {
    return "Mobile number must be exactly 12 digits including the country code (e.g., +91XXXXXXXXXX)";
  }

  return ""; // Return empty string if validation passes
};

// APP
export default function SettingsCard() {
  const dispatch = useDispatch();

  // Form states
  const user = useSelector((store: RootState) => store.user.user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
  });
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [edit, update] = useState({
    required: true,
    disabled: true,
    isEdit: true,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  
    // Clear the error dynamically
    if (name === "name") {
      const nameError = validateName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: nameError || undefined,
      }));
    }
  
    if (name === "mobile") {
      const mobileError = validateMobile(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: mobileError || undefined,
      }));
    }
  };

  // Handle submit with validation
  const handleSubmit = async () => {
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);

    if (nameError || mobileError) {
      setErrors({ name: nameError, mobile: mobileError });
      return;
    }

    try {
      const response = await updateUser(formData);
      if (response) {
        dispatch(userActions.saveUser({ ...response, role: "student" }));
        toast.success("Username updated successfully");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update the user.");
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      <Divider />

      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" },
          }}
        >
          <FormControl fullWidth>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3} mb={3}>
              {/* Name Field */}
              <Box component="form" flex={1}>
                <CustomInput
                  id="name"
                  name="name"
                  value={formData.name} // Controlled value
                  onChange={handleChange} // Handle change
                  title="Name"
                  error={!!errors.name} // Error prop to highlight the input
                  helperText={errors.name} // Error message
                />
              </Box>

              {/* Phone Field */}
              <Box flex={1}>
                <CustomInput
                  id="phone"
                  name="mobile"
                  value={formData.mobile} // Controlled value
                  onChange={handleChange} // Handle change
                  title="Phone Number"
                  error={!!errors.mobile} // Error prop to highlight the input
                  helperText={errors.mobile} // Error message
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+</InputAdornment>,
                  }}
                />
              </Box>
            </Box>

            {/* Email Field */}
            <Box display="flex" gap={3} mb={3}>
              <Box flex={1}>
                <CustomInput
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email} // Controlled value
                  title="Email Address"
                  dis={edit.disabled}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }}>
              <Button
                sx={{
                  p: "0.8rem 2rem",
                  my: 1,
                  height: "2.5rem",
                  backgroundColor: "#5349CC",
                  "&:hover": {
                    backgroundColor: "#8a2be2",
                  },
                }}
                variant="contained"
                onClick={handleSubmit}
              >
                {edit.isEdit ? "EDIT" : "UPDATE"}
              </Button>
            </Box>
            <Box mt={2}>
              {errors.name && <Box color="error.main">{errors.name}</Box>}
              {errors.mobile && <Box color="error.main">{errors.mobile}</Box>}
            </Box>
          </FormControl>
        </CardContent>
      </form>
    </Card>
  );
}
