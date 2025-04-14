import { Link } from "react-router-dom";
import { TfiAlignJustify } from "react-icons/tfi";
import { RiLoginBoxFill } from "react-icons/ri";
import { IoMdChatboxes, IoMdHome } from "react-icons/io";
import { MdInventory } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import logo from "/assets/logo.png";

import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useContext(UserContext);

  function handleClick() {
    setIsVisible(!isVisible);
  }
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 h-[5rem]">
        <Link to={user ? `/${user.id}` : "/"}>
          <img
            src={logo}
            className="w-[70px] h-[50px] sm:w-[90px] sm:h-[75px]"
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden sm:flex space-x-6 text-black font-medium md:text-[15px] lg:text-[18px]">
            <li className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition">
              <Link to={user ? `/${user.id}` : "/"}>Home</Link>
              <IoMdHome />
            </li>

            {user?.role === "Consumer" && (
              <li className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition">
                <Link to={`/${user.id}/procure`}>Procure</Link>
                <GiMedicines />
              </li>
            )}

            {user?.role === "Retailer" && (
              <>
                <li className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition">
                  <Link to={`/${user.id}/inventory`}>Inventory</Link>
                  <MdInventory />
                </li>
                <li className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition">
                  <Link to={`/${user.id}/add`}>Stock</Link>
                  <FaWarehouse />
                </li>
              </>
            )}

            <li className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition">
              <Link to={user?.id ? `/${user.id}/chat` : "/chat"}>Chat</Link>
              <IoMdChatboxes />
            </li>
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 p-2 hover:text-[#9bd300] hover:scale-105 transition"
              >
                LOG IN <RiLoginBoxFill />
              </Link>
              <span>/</span>
              <Link
                to="/signup"
                className="flex items-center gap-1 p-2 hover:text-[#9bd300] hover:scale-105 transition"
              >
                SIGN UP <FaUserPlus />
              </Link>
            </>
          ) : (
            <Link
              to={`/${user.id}/user`}
              className="flex items-center gap-2 p-2 hover:text-[#9bd300] hover:scale-105 transition"
            >
              Profile <FaUser />
            </Link>
          )}
        </div>

        <button
          className="sm:hidden p-2"
          onClick={handleClick}
          aria-label="Toggle Menu"
        >
          <TfiAlignJustify className="text-black text-[20px]" />
        </button>
      </nav>

      {isVisible && (
        <div className="sm:hidden p-6 font-medium bg-white w-full shadow-lg transition-all duration-300 ease-in-out">
          <ul className="flex flex-col w-full items-center justify-center gap-6">
            <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
              <Link to={user ? `/${user.id}` : "/"}>Home</Link>
              <IoMdHome />
            </li>

            {user?.role === "Consumer" && (
              <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                <Link to={`/${user.id}/procure`}>Procure</Link>
                <GiMedicines />
              </li>
            )}

            {user?.role === "Retailer" && (
              <>
                <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                  <Link to={`/${user.id}/inventory`}>Inventory</Link>
                  <MdInventory />
                </li>
                <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                  <Link to={`/${user.id}/add`}>Stock</Link>
                  <FaWarehouse />
                </li>
              </>
            )}

            <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
              <Link to={user?.id ? `/${user.id}/chat` : "/chat"}>Chat</Link>
              <IoMdChatboxes />
            </li>

            {!user ? (
              <>
                <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                  <Link to="/login">LOG IN</Link>
                  <RiLoginBoxFill />
                </li>
                <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                  <Link to="/signup">SIGN UP</Link>
                  <FaUserPlus />
                </li>
              </>
            ) : (
              <li className="flex items-center gap-2 hover:text-[#9bd300] transition">
                <Link to={`/${user.id}/user`}>Profile</Link>
                <FaUser />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
