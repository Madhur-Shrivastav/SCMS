import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import CityDropdown from "./CityDropdown";
import AWS_SignUp from "../functions/auth/AWS_SignUp";
import { storage } from "../functions/firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    city: "",
    state: "",
    password: "",
    role: "",
    profileImage: null,
  });

  const roles = ["Consumer", "Retailer"];
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  console.log(formData);

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [name]: value,
      };

      if (name === "state") {
        updatedFormData.city = "";
      }
      if (name === "role") {
        updatedFormData.role = value;
      }

      return updatedFormData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profileImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(
          `Upload Progress: ${
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          }%`
        );
      },
      (error) => {
        console.error("File upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevData) => ({
          ...prevData,
          profileImage: downloadURL,
        }));
        console.log("File available at", downloadURL);
      }
    );
  };

  const handleSignUp = async (formData) => {
    console.log(formData);
    AWS_SignUp(formData)
      .then((message) => {
        console.log(
          message +
            `An account confirmation code has been sent to your email for verification.`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 p-[4rem] rounded-2xl w-full sm:w-[35rem] lg:w-[40rem] sm:my-[3rem]"
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Create Your Account
          </h1>
          <div className=" mb-2">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Log In
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5">
          <label className="relative w-full my-3">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              First Name
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Last Name
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Email
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Contact No
            </span>
          </label>
          <label className="relative w-full my-3">
            <CityDropdown
              selectedState={formData.state}
              value={formData.city}
              onChange={(city) => handleChange("city", city)}
            ></CityDropdown>
          </label>
          <label className="relative w-full my-3">
            <Dropdown
              options={states}
              label="Select state"
              value={formData.state}
              onChange={(state) => handleChange("state", state)}
            ></Dropdown>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="relative w-full my-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-yellow-300 peer p-1"
              required
            />
            <span className="absolute text-black text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 peer-valid:text-sm peer-valid:-translate-y-5 peer-valid:px-1 peer-focus:text-yellow-300 peer-valid:text-yellow-300">
              Password
            </span>
          </label>
          <label className=" w-full my-3">
            <Dropdown
              options={roles}
              label="Select role"
              value={formData.role}
              onChange={(role) => handleChange("role", role)}
            ></Dropdown>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2 rounded-lg shadow-sm hover:bg-gray-100 focus:border-2 focus:border-yellow-300 duration-300 focus:outline-none">
          <input
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className="text-black font-medium cursor-pointer inline-block px-10 py-4"
          >
            Choose a picture
          </label>
        </div>
        {formData.profileImage && (
          <img
            src={formData.profileImage}
            alt="Profile Preview"
            className="w-32 h-32 object-cover rounded-full mx-auto"
          />
        )}
        <button
          type="submit"
          className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] duration-[300ms] font-bold text-[14px] w-full"
        >
          CREATE ACCOUNT
        </button>

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

export default SignUp;
