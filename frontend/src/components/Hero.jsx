import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SearchBar from "../components/SearchBar";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useContext(UserContext);
  return (
    <section className="flex flex-col items-center justify-center px-4 py-10 gap-8 min-h-screen">
      {user?.role === "Consumer" ? (
        <Link
          to={user ? `/${user.id}/procure` : "/login"}
          className="w-full flex justify-center"
        >
          <SearchBar />
        </Link>
      ) : user?.role === "Retailer" ? (
        <Link
          to={user ? `/${user.id}/inventory` : "/login"}
          className="w-full flex justify-center"
        >
          <SearchBar />
        </Link>
      ) : null}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full max-w-5xl"
      >
        {[1, 2, 3].map((_, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center bg-white h-[300px] sm:h-[400px] md:h-[500px]"
          >
            <img
              src={`/assets/Home/${index + 1}.png`}
              alt="Medical Supply Chain"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col justify-center items-center text-center gap-6 md:gap-8">
        <h1 className="font-semibold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] leading-tight">
          The medicine website you've been looking for
        </h1>
        <p className="font-light text-gray-600 text-[15px] sm:text-[16px] md:text-[17px] max-w-xl">
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
