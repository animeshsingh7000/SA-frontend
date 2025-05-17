import React from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4.2,
  slidesToScroll: 4,
  swipeToSlide: true,
  arrows: false,
  className: "active-list-grid"
};
export default function Slider({ children }: { children: React.ReactNode }) {
  return <SlickSlider {...settings} className="active-user-content">{children}</SlickSlider>;
}
