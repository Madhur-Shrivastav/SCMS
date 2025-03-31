import { Link } from "react-router-dom";
import { TfiAlignJustify } from "react-icons/tfi";
import { RiLoginBoxFill, RiLogoutBoxRFill } from "react-icons/ri";
import { IoMdChatboxes, IoMdHome } from "react-icons/io";
import { MdInventory } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

import { ChartNoAxesCombinedIcon } from "lucide-react";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useContext(UserContext);

  function handleClick() {
    setIsVisible(!isVisible);
  }

  return (
    <header className="bg-white border-b-1">
      <nav className="sticky top-0 bg-white mx-12  lg:mx-18 z-10 flex gap-5 justify-between h-[5rem]">
        {/* <Link to="/">
          <img
            src="https://img.icons8.com/?size=50&id=5359&format=png"
            className="w-[70px] h-[50px] sm:w-[90px] sm:h-[75px]"
            alt="logo"
          />
        </Link> */}
        <div className="flex justify-center items-center lg:mr-[3rem]">
          <ul className="hidden sm:flex space-x-8 text-black font-medium md:text-[15px] lg:text-[18px]">
            <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105  p-2 gap-2">
              <Link to={user ? `/${user.id}` : "/"}>Home</Link>

              <IoMdHome />
            </li>
            {user?.role === "Consumer" ? (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to={user ? `/${user.id}/order` : "/login"}>Procure</Link>

                <GiMedicines />
              </li>
            ) : user?.role === "Retailer" ? (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to={user ? `/${user.id}/inventory` : "/login"}>
                  Inventory
                </Link>

                <MdInventory />
              </li>
            ) : null}
            {user?.role === "Retailer" ? (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to={user ? `/${user.id}/orders` : "/login"}>Orders</Link>

                <FaClipboardList />
              </li>
            ) : user?.role === "Consumer" ? (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to={user ? `/${user.id}/transactions` : "/login"}>
                  Bills
                </Link>

                <ChartNoAxesCombinedIcon />
              </li>
            ) : null}

            {user?.id ? (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to={`/${user.id}/chat`}>Chat </Link>
                <IoMdChatboxes />
              </li>
            ) : (
              <li className="flex items-center transition duration-300 font-medium hover:text-yellow-300 hover:scale-105 p-2 gap-2">
                <Link to="/chat">Chat </Link>
                <IoMdChatboxes />
              </li>
            )}
          </ul>

          <button
            className="sm:hidden p-2"
            onClick={handleClick}
            aria-label="Toggle Menu"
          >
            <TfiAlignJustify className="text-black text-[16px]" />
          </button>
        </div>
        {!user ? (
          <li className="flex">
            <div className="flex items-center p-2 gap-1 hover:text-yellow-300 transition duration-300 font-medium hover:scale-105">
              <Link to="/login">LOG IN</Link>
              <RiLoginBoxFill />
            </div>
            <div className="flex items-center ">/</div>
            <div className="flex items-center p-2 gap-1 hover:text-yellow-300 transition duration-300 font-medium hover:scale-105">
              {" "}
              <Link to="/signup"> SIGN UP </Link>
              <FaUserPlus />
            </div>
          </li>
        ) : (
          <li className="flex items-center gap-2 hover:text-yellow-300 transition duration-300 font-medium hover:scale-105 p-2">
            <Link to={`/${user.id}/user`}>Profile</Link>

            <FaUser />
          </li>
        )}

        <div
          className={`${
            isVisible ? "flex" : "hidden"
          } flex-col gap-6 p-6 font-medium items-center bg-white w-full sm:hidden transition-all duration-300 ease-in-out`}
        >
          <Link
            className="transition duration-300 hover:text-yellow-300 hover:scale-105 hover:rounded-lg p-2"
            to="/"
            onClick={() => setIsVisible(false)}
          >
            Home
          </Link>
          <Link
            className="transition duration-300 hover:text-yellow-300 hover:scale-105 hover:rounded-lg p-2"
            to="/about"
            onClick={() => setIsVisible(false)}
          >
            About Us
          </Link>

          <Link
            className="transition duration-300 hover:text-yellow-300 hover:scale-105 hover:rounded-lg p-2"
            to="/contact"
            onClick={() => setIsVisible(false)}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
