import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Button from "./ui/Button";

const HeroSection = () => {
  return (
    <main className="flex flex-col w-full min-h-screen justify-center items-center bg-white overflow-hidden">
      <div className="flex flex-col max-w-3xl px-6 md:px-12 text-center space-y-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl md:text-6xl font-marcellus leading-tight">
            Experience Events Like Never Before.
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-gray-700">
            Lorem ipsum dolor sit amet consectetur. Ac enim tristique blandit
            fringilla enim consequat. Odio pellentesque aliquam scelerisque elit
            leo.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-10">
          <Button title={"Get Started"} icon />
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
