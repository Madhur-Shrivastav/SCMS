import React from "react";

const Hero = () => {
  return (
    <section className="flex">
      <img
        className="hidden lg:flex w-[45%] p-2"
        src="https://www.karexpert.com/wp-content/uploads/2021/06/medical-SCM-hero.png"
        //src="https://go.drugbank.com/assets/pages/home/HeroGraphicLeft-be9a6e0a744918ab65df69c7aca3743ff4711b3748609e3a3309af2c8802a793.png"
        alt=""
      />

      <div className="flex flex-col justify-center items-center text-center gap-[2rem] my-[5rem] mx-[2.5rem] md:my-[10rem] md:mx-[10rem] lg:my-[5rem] lg:mx-[1rem]">
        <h1 className="font-semibold text-[35px] sm:text-[42px] lg:text-[45px] lg:leading-[50px] ">
          The medicine website you've been looking for
        </h1>
        <p className="font-light text-gray-600 text-[15px]">
          Discover a seamless way to find and purchase medicines from trusted
          retailers in your city. Our platform offers a vast selection of
          medicines with detailed information, real-time inventory updates, and
          hassle-free ordering. Whether you need a quick purchase or want to
          track your orders effortlessly, we’ve got you covered.
        </p>
      </div>
    </section>
  );
};

export default Hero;
