import React, { useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usercontext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const { token, role } = useContext(usercontext);
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero logo + text float-in animation (on load)
      const heroElements = heroRef.current.querySelectorAll(".hero-fade");
      gsap.fromTo(
        heroElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
        }
      );

      // Add gentle floating effect to logo
      gsap.to(".hero-logo", {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2.5,
      });

      // Animate fade-in elements on scroll
      gsap.utils.toArray(".fade-in").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Parallax scroll effect for images
      gsap.utils.toArray(".card-image").forEach((img) => {
        gsap.to(img, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white overflow-x-hidden text-gray-800"
    >
      {/* ✅ HERO SECTION */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-6 py-24 sm:py-28"
      >
        {/* Logo */}
        <img
          src="/myLogo.png"
          alt="ShopMaster Logo"
          className="hero-logo hero-fade h-40 sm:h-48 w-auto object-contain mb-6 drop-shadow-lg"
        />

        {/* Text */}
        <h1 className="hero-fade text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">ShopMaster</span>
        </h1>
        <p className="hero-fade max-w-2xl mx-auto text-gray-600 text-lg mb-8 leading-relaxed">
          ShopMaster is your trusted digital marketplace — connecting buyers and
          sellers seamlessly. Discover premium products, enjoy quick delivery,
          and experience the convenience of a platform built for your needs.
        </p>

        {/* Buttons */}
        <div className="hero-fade flex flex-col sm:flex-row justify-center gap-4">
          {role === "seller" ? (
            <button
              onClick={() =>
                token ? navigate("/create-product") : navigate("/login")
              }
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-md font-semibold transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/50 duration-300"
            >
              Sell Now
            </button>
          ) : (
            <button
              onClick={() =>
                token ? navigate("/view-all-product") : navigate("/login")
              }
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-md font-semibold transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/50 duration-300"
            >
              Shop Now
            </button>
          )}
          <button
            onClick={() => navigate("/about")}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition transform hover:-translate-y-1 duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-indigo-50 via-transparent to-transparent" />
      </section>

      {/* ✅ MAIN CONTENT SECTIONS */}
      <div className="border my-4 mx-6 sm:mx-12 bg-gray-100 rounded-3xl border-gray-300 shadow-md p-8 space-y-20">
        {/* SECTION 1 */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl mx-auto py-12 px-6">
          <div className="md:w-1/2 space-y-5">
            <h2 className="fade-in text-3xl font-bold text-gray-800">
              Seamless Shopping Experience
            </h2>
            <p className="fade-in text-gray-600 text-lg leading-relaxed">
              From browsing to checkout, ShopMaster ensures every click feels
              effortless. Our clean design and lightning-fast search help you
              discover exactly what you need. Save your favorites, get
              personalized recommendations, and enjoy a shopping experience that
              feels made just for you.
            </p>
            <button
              onClick={() => navigate("/view-all-product")}
              className="fade-in bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-md font-medium transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/50 duration-300"
            >
              Start Shopping
            </button>
          </div>

          <div className="md:w-1/2 shadow-lg bg-white rounded-2xl">
            <img
              src="https://img.freepik.com/premium-photo/seamless-shopping-experience-3d-vector-render-online-shopping-bag-easy-product-add-cart-ecommerce-simplified_776674-531501.jpg"
              alt="Seamless Shopping"
              className="card-image rounded-2xl fade-in w-full h-80 object-cover"
            />
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="flex flex-col md:flex-row-reverse items-center justify-between gap-10 max-w-6xl mx-auto py-12 px-6">
          <div className="md:w-1/2 space-y-5">
            <h2 className="fade-in text-3xl font-bold text-gray-800">
              Empowering Sellers to Grow
            </h2>
            <p className="fade-in text-gray-600 text-lg leading-relaxed">
              ShopMaster isn’t just for buyers — it’s built for entrepreneurs.
              Manage your store, track orders, and promote your products from
              one simple dashboard. With real-time insights and marketing tools,
              growing your business has never been easier.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="fade-in bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-6 py-2 rounded-md font-medium transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-300/50 duration-300"
            >
              Become a Seller
            </button>
          </div>

          <div className="md:w-1/2 rounded-2xl shadow-lg bg-white">
            <img
              src="https://www.shutterstock.com/image-illustration/icon-marketing-graph-analyze-3d-600nw-2020578566.jpg"
              alt="Empowering Sellers"
              className="card-image fade-in w-full h-80 object-cover rounded-2xl"
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl mx-auto py-12 px-6">
          <div className="md:w-1/2 space-y-5">
            <h2 className="fade-in text-3xl font-bold text-gray-800">
              Secure Payments & Trusted Partners
            </h2>
            <p className="fade-in text-gray-600 text-lg leading-relaxed">
              Shop with confidence. All transactions are encrypted and verified
              through trusted gateways. Our partnerships with leading logistics
              and payment companies ensure your purchases are protected from
              start to finish — because your peace of mind matters most.
            </p>
            <button
              onClick={() => navigate("/about")}
              className="fade-in bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-md font-medium transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/50 duration-300"
            >
              Learn About Us
            </button>
          </div>

          <div className="md:w-1/2 rounded-2xl shadow-lg bg-white">
            <img
              src="https://img.freepik.com/premium-photo/3d-rendering-user-account-protection-online-payments-bankin_968898-340.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Secure Payment"
              className="card-image fade-in w-full h-80 object-cover rounded-2xl"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
