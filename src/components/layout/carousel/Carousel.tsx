import React, { FC } from "react";
import HeroSlider from "react-slick";
import "../../../styles/Carousel.css";

const Carousel: FC = () => {
  const images = ["banner1.png", "banner2.png", "banner3.png"];

  const settings = {
    arrows: false,
    slidesToShow: 1,
    infinite: true,
    dots: true,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };

  return (
    <>
        <HeroSlider {...settings}>
          {images.map((image) => (
            <div className="w-full h-full px-2 py-3 border-0" key={image}>
              <img
                src={`/assets/${image}`}
                alt={`Hero Banner ${image}`}
                className="w-full h-full rounded img-fluid object-cover carousel-img"
              />
            </div>
          ))}
        </HeroSlider>
    </>
  );
};

export default Carousel;