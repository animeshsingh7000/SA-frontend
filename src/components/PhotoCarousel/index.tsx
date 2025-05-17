import React from "react";
import Glider from "react-glider";
// import Slide from "./Slide";

const defaultConfig = {
  duration: 0.75,
  slidesToShow: 1,
  slidesToScroll: 1,
  scrollLock: true,
  itemWidth: undefined
};

const PhotosCarousel = ({
  children = [],
  onSlideChange = () => null,
  initialSlideIdx = 1,
  currentSlideIdx = 1,
  className = "",
  config: customConfig = {},
  style = ""
}) => {
  const carouselRef = React.useRef(null);

  const config = React.useMemo(() => {
    return Object.assign({}, defaultConfig, customConfig);
  }, [customConfig]);

  React.useEffect(() => {
    const glider:any = carouselRef.current;
    if(glider) {
        if (glider.slide !== currentSlideIdx) {
            glider.scrollItem(currentSlideIdx);
        }
    }
    
  }, [currentSlideIdx]);

  const slides = children.map((item:any) => <div key={item.key}>{item}</div>);

  return (
    <div className={className}>
      <Glider
        ref={carouselRef}
        draggable
        hasArrows
        slidesToShow={config.slidesToShow}
        slidesToScroll={config.slidesToScroll}
        duration={config.duration}
        scrollLock={config.scrollLock}
        itemWidth={config.itemWidth}
        onSlideVisible={(context) => onSlideChange()}
        scrollToSlide={initialSlideIdx}
      >
        {slides}
      </Glider>
    </div>
  );
};

export default PhotosCarousel;