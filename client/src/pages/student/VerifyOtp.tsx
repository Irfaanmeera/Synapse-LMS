import React from "react";
import OtpVerification from "../../components/auth/OtpVerification";


const VerifyOtp: React.FC<{
  isInstructor: boolean;
}> = (props) => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-black">
      {/* {props.isForgotPassword ? (
        <ForgotPasswordOtpVerificationForm isInstructor={props.isInstructor} />
      ) : ( */}
        <OtpVerification isInstructor={props.isInstructor} />
      {/* )} */}
    </div>
  );
};

export default VerifyOtp;