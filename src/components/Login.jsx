import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AWS_LogIn from "../functions/auth/AWS_LogIn";
import AWS_LogOut from "../functions/auth/AWS_LogOut";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (formData) => {
    console.log(formData);
    AWS_LogIn(formData)
      .then((user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User:" + user);
        navigate(`/${user.id}/user`);
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  const handleLogout = () => {
    AWS_LogOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 my-[3rem] px-[2rem] py-[1rem] rounded-2xl w-full sm:w-[35rem] h-full "
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Log Into Your Account
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
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Email
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Password
            </span>
          </label>
          <div className=" mb-2">
            <p>
              <Link to="/forgot" className="text-blue-600">
                Forgot Password?
              </Link>{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-[1rem]">
          <button
            type="submit"
            className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] duration-[300ms] font-bold text-[14px] w-full"
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] duration-[300ms] font-bold text-[14px] w-full"
          >
            LOG OUT
          </button>
        </div>

        <div className=" mb-2">
          <p>
            Make sure to{" "}
            <Link to="/confirm" className="text-blue-600">
              Confirm Sign Up
            </Link>{" "}
            before logging in.{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
