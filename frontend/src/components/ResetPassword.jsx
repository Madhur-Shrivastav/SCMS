import { useState } from "react";
import { Link } from "react-router-dom";
import AWS_ConfirmResetPassword from "../functions/auth/AWS_ConfirmResetPassword";
import { useAlert } from "../contexts/AlertContext";
const ResetPassword = () => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = async (formData) => {
    console.log(formData);
    AWS_ConfirmResetPassword(formData)
      .then((message) => {
        console.log(message);
        showAlert("success", message);
      })
      .catch((error) => {
        console.error("Login Error:", error);
        showAlert(
          "error",
          "Password must contain a digit, a small letter, a capital letter and a special character!"
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReset(formData);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 my-[3rem] px-[2rem] py-[1rem] rounded-2xl w-full sm:w-[35rem] h-full "
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Reset Your Password
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
              value={formData.email}
              onChange={handleChange}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-[#9bd300] peer-valid:text-[#9bd300]">
              Email
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-[#9bd300] peer-valid:text-[#9bd300]">
              Reset Password Code
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="password"
              name="newpassword"
              value={formData.newpassword}
              onChange={handleChange}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-[#9bd300] peer-valid:text-[#9bd300]">
              New Password
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] hover:cursor-pointer duration-[300ms] font-bold text-[14px] w-full"
        >
          RESET PASSWORD
        </button>
        <div className=" mb-2">
          <p>
            Did not receive the code?{" "}
            <Link to="/forgot" className="text-blue-600">
              Send again
            </Link>{" "}
          </p>
          <p>
            Go to{" "}
            <Link to="/login" className="text-blue-600">
              Log In
            </Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
