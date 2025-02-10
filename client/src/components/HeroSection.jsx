import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sliderData from "../data/sliderData.json";

import Button from "./ui/Button";

const HeroSection = () => {

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <main className="flex flex-col flex-grow w-full mx-auto justify-center">
    <div className="flex flex-col max-w-3xl px-6 md:px-12 mx-auto justify-center items-center text-center space-y-10">
      <div className="flex flex-col w-full mx-auto gap-2">
      <h2 className="text-4xl md:text-6xl font-marcellus leading-tight">
        Experience Events Like Never Before.
      </h2>
      <p className="max-w-2xl text-lg md:text-xl text-gray-700">
        Lorem ipsum dolor sit amet consectetur. Ac enim tristique blandit fringilla enim consequat. Odio pellentesque aliquam scelerisque elit leo.
      </p>
      </div>
      <Button title={"Get Started"} icon />
    </div>

      {/* Slider Container */}
      {/* <div className="w-full mt-12">
        <Slider {...settings} className="flex justify-center items-center">
          {sliderData.map((data) => (
            <div
              key={data.id}
              className="px-2 flex justify-center items-center"
            >
              <img
                className={`object-cover h-56 w-56 ${
                  data.id % 2 === 0 ? "rounded-3xl" : "rounded-[4rem]"
                } shadow-lg`}
                src={`../assets/${data.name}`}
                alt={data.alt || "Event Image"}
              />
            </div>
          ))}
        </Slider>
      </div> */}
    </main>
  );
};

export default HeroSection;
