import "./Profile.scss";
import profile_src from "../../assets/others/profile.jpg";
import { FiEdit3 } from "react-icons/fi";
import { RiUser3Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { IoLogOutOutline } from "react-icons/io5";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Profile = () => {
  const { ShowProfile, mobileView, user, logout } = useContext(SharedContext);
  const navigate = useNavigate();

  // 🔹 Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Sign out from Firebase Auth
      logout(); // ✅ Remove user from context
      localStorage.clear(); // ✅ Clear stored data
      sessionStorage.clear();
      navigate("/login"); // 🔄 Redirect to Login
    } catch (error) {
      console.error("🔥 Logout Error:", error);
    }
  };

  if (!mobileView) {
    return (
      <div className={`profile_info ${ShowProfile && "show"}`}>
        <header>
          <img src={profile_src} alt="Profile" />
          <div className="username">
            <span>{user?.firstName || "Guest"} {user?.lastName || ""}</span>
            <span className="email">{user?.email || "guest@example.com"}</span>
          </div>
        </header>

        <ul>
          {user ? (
            <>
              <li>
                <RiUser3Line className="icon" /> Account
              </li>
              <li onClick={() => navigate("/settings")}> {/* ✅ Redirects to Settings */}
                <VscSettings className="icon" />
                Settings
              </li>
              <li className="logout" onClick={handleLogout}>
                <IoLogOutOutline className="icon" />
                Logout
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="default-login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  }
};

export default Profile;
