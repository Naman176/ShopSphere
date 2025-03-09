import { useState } from "react";
import {
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { ImHome, ImSearch } from "react-icons/im";
import { Link } from "react-router-dom";

const user = { _id: "dhvbs", role: "admin" };

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <nav className="header">
      <section className="logo"></section>
      <div className="headerItems">
        <Link onClick={() => setIsOpen(false)} to={"/"}>
          <ImHome />
        </Link>
        <Link onClick={() => setIsOpen(false)} to={"/search"}>
          <ImSearch />
        </Link>
        <Link onClick={() => setIsOpen(false)} to={"/cart"}>
          <FaShoppingBag />
        </Link>
        {user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {user.role === "admin" && (
                  <Link
                    onClick={() => setIsOpen((prev) => !prev)}
                    to={"/admin/dashboard"}
                  >
                    Admin
                  </Link>
                )}
                <Link onClick={() => setIsOpen((prev) => !prev)} to={"/orders"}>
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
