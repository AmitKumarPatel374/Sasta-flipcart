import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade & slide animation for sections
      gsap.utils.toArray(".fade-section").forEach((section, i) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Logo gentle float
      gsap.to(".about-logo", {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2.5,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-8 py-16 sm:py-24 overflow-hidden"
    >
      {/* Header Section */}
      <div className="text-center mb-16 fade-section">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 mb-4 tracking-wide drop-shadow-sm">
            About <span className="text-purple-700">ShopMaster</span>
          </h1>
          <img
            src="/myLogo.png"
            alt="ShopMaster Logo"
            className="about-logo h-16 sm:h-20 w-auto object-contain"
          />
        </div>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Empowering both buyers and sellers through trust, quality, and seamless shopping.
        </p>
      </div>

      {/* Section 1 - Text Left | Video Right */}
      <section className="fade-section max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-12">
        {/* Text */}
        <div className="md:w-1/2 rounded-2xl p-8 sm:p-10 text-gray-700 leading-relaxed space-y-6 ">
          <p className="text-lg">
            Welcome to{" "}
            <span className="font-semibold text-indigo-600">ShopMaster</span> — your all-in-one
            marketplace for innovation and opportunity. Whether you're a buyer exploring the latest
            trends or a seller growing your business, ShopMaster makes it effortless and rewarding.
          </p>
          <p className="text-lg">
            Since <span className="font-semibold">2023</span>, we’ve been crafting an ecommerce
            experience where <span className="text-purple-700 font-semibold">trust meets technology</span>.
            Our platform blends convenience, fairness, and smart design for everyone.
          </p>
          <p className="italic text-indigo-700 font-semibold text-center md:text-left">
            “Where buyers discover, and sellers grow.”
          </p>
        </div>

        {/* Video */}
        <div className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl">
          <video
            src="/shopmaster1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          ></video>
        </div>
      </section>

      {/* Section 2 - Video Left | Text Right */}
      <section className="fade-section max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 py-12">
        {/* Text */}
        <div className="md:w-1/2 bg-white rounded-2xl  p-8 sm:p-10 text-gray-700 leading-relaxed space-y-6 ">
          <p className="text-lg">
            From fashion essentials to reliable gadgets, our marketplace thrives on curated
            excellence. Every product reflects our commitment to{" "}
            <span className="font-semibold text-indigo-700">quality and authenticity</span>.
          </p>
          <p className="text-lg">
            Our smart algorithms and secure infrastructure ensure a smooth experience — empowering
            sellers and delighting customers. Join our growing community and be part of the new era
            of ecommerce.
          </p>
          <p className="italic text-purple-700 font-semibold text-center md:text-left">
            “Shop smarter. Sell better. Live bigger.”
          </p>
        </div>

        {/* Video */}
        <div className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl">
          <video
            src="shopmaster2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          ></video>
        </div>
      </section>

      {/* Mission & Core Values */}
      <div className="fade-section mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          Our Mission & Core Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Value 1 */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">🤝 Trust & Transparency</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Every transaction is built on honesty — ensuring both buyers and sellers feel secure.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 transition duration-300 border-t-4 border-purple-500">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">🚀 Growth for Sellers</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              We empower small businesses with visibility and tools to expand their reach globally.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 transition duration-300 border-t-4 border-indigo-600">
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">🌟 Smart Shopping</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Our platform curates the best deals and products to make every purchase worth it.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="fade-section mt-20 text-center">
        <p className="text-xl sm:text-2xl font-semibold text-indigo-800 italic">
          “ShopMaster — Building bridges between shoppers and sellers, one product at a time.”
        </p>
      </div>
    </div>
  );
};

export default About;
