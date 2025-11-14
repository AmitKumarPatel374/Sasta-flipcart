import React from "react";
import Slider from "react-slick";

const HomeProductSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="w-full h-[80vh] overflow-hidden relative rounded-xl mt-5 p-5 bg-gray-500">
      <Slider {...sliderSettings}>
        <img
          src="/Fashion.png"
          alt="fashion"
          className="w-full h-[75vh] object-cover rounded-xl"
        />
        <img
          src="/ferniture.jpeg"
          alt="furniture"
          className="w-full h-[75vh] object-cover rounded-xl"
        />
        <img
          src="/electronocs.png"
          alt="electronics"
          className="w-full h-[75vh] object-cover rounded-xl"
        />
        <img
          src="/beauty.jpeg"
          alt="beauty"
          className="w-full h-[75vh]object-cover rounded-xl"
        />
        <img
          src="/grocery.jpeg"
          alt="grocery"
          className="w-full h-[75vh] object-cover rounded-xl"
        />
        <img
          src="/mobile.jpeg"
          alt="mobile"
          className="w-full h-[75vh] object-cover object-top  rounded-xl"
        />
      </Slider>
    </div>
  );
};

export default HomeProductSlider;
