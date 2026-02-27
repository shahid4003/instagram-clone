import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlinePlusSquare,
  AiOutlineHeart,
} from "react-icons/ai";
import { BsCompass, BsCameraReels } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import SuggestedUserSidebar from "../components/SuggestedUserSidebar";
import useFetch from "../hooks/UseFetch";

const AdminLayout = ({ children, showSuggestions, icon_Sidebar = false }) =>{
	const location = useLocation();
  const isMessagesPage = location.pathname.startsWith("/messages");
  const [showFullSidebar, setShowFullSidebar] = useState(!icon_Sidebar);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data = {} } = useFetch({ url: "/user/me" });
  const { username = "", name = "", img = "" } = data?.user || {};
  const safeImg =
    img && img.trim().length > 0
      ? img
      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80";

  const menuItems = [
    { icon: AiOutlineHome, label: "Home", href: "/" },
    { icon: AiOutlineSearch, label: "Search", href: "#" },
    { icon: BsCompass, label: "Explore", href: "#" },
    { icon: BsCameraReels, label: "Reels", href: "#" },
    { icon: FiSend, label: "Messages", href: "/messages", badge: "12" },
    { icon: AiOutlineHeart, label: "Notifications", href: "#" },
    { icon: AiOutlinePlusSquare, label: "Create", href: "/post/new" },
  ];

  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href.replace("#", ""))) return true;
    return false;
  };

  return (
    <div className="bg-white min-h-screen flex w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${
          showFullSidebar ? "w-[245px] px-4" : "w-[80px]"
        } fixed top-0 left-0 h-full py-6 border-r border-gray-200 flex flex-col justify-between transition-all duration-300 bg-white z-40`}
      >
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent cursor-pointer group-hover:opacity-75 transition">
              {showFullSidebar ? (
                "Instagram"
              ) : (
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  className="mx-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <linearGradient
                    id="instagram-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#833AB4" />
                    <stop offset="50%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#FF6B00" />
                  </linearGradient>
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="url(#instagram-gradient)"
                    strokeWidth="2"
                  />
                  <rect
                    x="7"
                    y="7"
                    width="10"
                    height="10"
                    rx="2.5"
                    stroke="url(#instagram-gradient)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="17"
                    cy="7"
                    r="1"
                    fill="url(#instagram-gradient)"
                  />
                </svg>
              )}
            </h2>
          </div>
          <nav>
            <ul className="flex flex-col space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={index}
                    className={`flex items-center rounded-xl p-3 cursor-pointer transition ${
                      isActive(item.href)
                        ? ""
                        : "hover:bg-gray-50"
                    } ${showFullSidebar ? "justify-start" : "justify-center"}`}
                  >
                    <Link
                      to={item.href}
                      className="flex items-center relative w-full text-gray-700"
                    >
                      <Icon size={24} />
                      {showFullSidebar && (
                        <span className="ml-4 text-[16px] text-gray-900">
                          {item.label}
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`${
                            showFullSidebar
                              ? "absolute top-0 right-0"
                              : "absolute -top-2 -right-2"
                          } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Profile */}
        <Link
          to={`/${username}`}
          className={`flex items-center mt-8 cursor-pointer hover:bg-gray-100 p-3 rounded-xl ${
            showFullSidebar ? "" : "justify-center"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <img
                src={safeImg}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          {showFullSidebar && (
            <span className="ml-4 text-[16px] text-gray-900">
              {name || username}
            </span>
          )}
        </Link>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <h2 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Instagram
        </h2>
        <div className="flex items-center gap-4">
          <Link to="/messages" className="text-gray-700">
            <FiSend size={24} />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50 px-2">
        <Link
          to="/"
          className={`p-3 rounded-xl ${
            isActive("/") ? "text-gray-900" : "text-gray-700"
          }`}
        >
          <AiOutlineHome size={24} />
        </Link>
        <Link to="#" className="p-3 text-gray-700">
          <AiOutlineSearch size={24} />
        </Link>
        <Link to="/post/new" className="p-2 text-gray-700">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <AiOutlinePlusSquare size={24} />
          </div>
        </Link>
        <Link to="/messages" className={`p-3 rounded-xl ${isActive("/messages") ? "text-gray-900" : "text-gray-700"}`}>
          <FiSend size={24} />
        </Link>
        <Link
          to={`/${username}`}
          className="p-1"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <img
                src={safeImg}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </Link>
      </nav>

      {/* Main Content */}
      <div
        className={`flex flex-1 w-full md:${
          showFullSidebar ? "ml-[245px]" : "ml-[80px]"
        } pt-14 pb-16 md:pb-0 md:pt-0 transition-all duration-300`}
      >
        <main  className={`flex-1 mx-auto py-4 md:py-6 w-full
        ${
          isMessagesPage
            ? "max-w-7xl px-4"   // Wider for messages
            : "max-w-[36rem] md:max-w-3xl lg:max-w-6xl px-3 sm:px-4"
        }
      `}>
          {children}
        </main>
        {showSuggestions && (
          <div className="hidden lg:block">
            <SuggestedUserSidebar />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLayout;
