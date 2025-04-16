import { useState } from "react";
import { Link } from "react-router-dom";
import AWS_ForgotPassword from "../functions/auth/AWS_ForgotPassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    try {
      const response = await AWS_ForgotPassword(email);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword();
  };
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 my-[3rem] px-[2rem] py-[1rem] rounded-2xl w-full sm:w-[35rem] h-full "
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Get Password Reset Code
          </h1>
          <div className="mb-4">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="relative w-full my-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-[#9bd300] peer-valid:text-[#9bd300]">
              Email
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] hover:cursor-pointer duration-[300ms] font-bold text-[14px] w-full"
        >
          SEND RESET CODE
        </button>

        <div className=" mb-2">
          <p>
            Make sure to{" "}
            <Link to="/reset" className="text-blue-600">
              reset your password
            </Link>{" "}
            after receiving the reset code.{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
