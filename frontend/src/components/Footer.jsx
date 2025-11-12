import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { usercontext } from "../context/DataContext";

const Footer = () => {
  const { role, user_id } = useContext(usercontext);
  const isUser = role === "user";

  const animatedLink = "relative inline-block after:block after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all after:duration-300 after:mt-1 hover:after:w-full";

  return (
    <footer className="bg-gray-200 text-gray-800 pt-12 pb-6 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <img
            src="/myLogo.png"
            alt="ShopMaster Logo"
            className="h-15 w-auto object-contain"
          />
          <p className="text-sm leading-6 text-gray-600">
            Your trusted place to shop for quality products at the best prices.
            Enjoy fast delivery, amazing deals, and reliable support — all in one place.
          </p>
        </div>

        {/* quick links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {isUser ? (
              <>
                <li>
                  <Link to="/" className={animatedLink}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/view-all-product" className={animatedLink}>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={animatedLink}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/user-profile" className={animatedLink}>
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={animatedLink}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/view-seller-products/${user_id}`}
                    className={animatedLink}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/create-product" className={animatedLink}>
                    Create Product
                  </Link>
                </li>
                <li>
                  <Link to="/view-users" className={animatedLink}>
                    View Users
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={animatedLink}>
                    about
                  </Link>
                </li>
                <li>
                  <Link to="/user-profile" className={animatedLink}>
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

       {/* contact section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Contact</h3>
          <p className="text-sm mb-2 text-gray-700">📞 +91 9753005051</p>
          <p className="text-sm mb-4 text-gray-700">✉️ amitpatel9302352967@gmail.com</p>

          <div className="flex space-x-4 text-xl">
            <a
              href="https://www.facebook.com/profile.php?id=100056457007719"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/simple_boy_amit_7/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kumar-patel-053130316/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/AmitKumarPatel374"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/*Bottom Line */}
      <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm text-gray-600">
        <p>
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold text-blue-600">Amit Kumar Patel</span>
        </p>
        <p className="mt-1 text-gray-500">
          © {new Date().getFullYear()} ShopMaster. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
