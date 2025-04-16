import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import AWS_ConfirmSignUp from "../functions/auth/AWS_ConfirmSignUp";
import { UserContext } from "../contexts/UserContext";
const ConfirmAccount = () => {
  const { showAlert } = useAlert();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleConfirmation = async (formData) => {
    console.log(formData);
    AWS_ConfirmSignUp(formData)
      .then((message) => {
        console.log(message);
        showAlert("success", "Your account has been confirmed, now can login!");
        navigate(`/login`);
      })
      .catch((error) => {
        console.error("Confirmation Error:", error.message);
        showAlert("error", error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmation(formData);
  };
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 my-[3rem] px-[2rem] py-[1rem] rounded-2xl w-full sm:w-[35rem] h-full "
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Confirm Your Account
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
              Conformation Code
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] hover:cursor-pointer duration-[300ms] font-bold text-[14px] w-full"
        >
          CONFIRM
        </button>
      </form>
    </div>
  );
};

export default ConfirmAccount;
