import React, { useState } from "react";
import PhotosCarousel from "../../../components/PhotoCarousel";
import ImageModel from "../../../components/Modal/ImageModel";
import placeHolder from "../../../assets/images/placeHolder.png";

const thumbnailsCarouselConfig = {
  itemWidth: 150,
  slidesToShow: "auto",
  slidesToScroll: "auto"
};

export default function ImageGallery({
    photoToShow,
    thumbsToShow,
    propertyOnDiscount = false
}: {
    photoToShow: any;
    thumbsToShow: any;
    propertyOnDiscount:any;
}) {
  // const thumbnailsGliderRef = React.useRef(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [imagePopup, showImagePopup] = useState(false);
  const [imageDetail, setImageDetail] = useState<any>(null);

  const onClickPhotoHandler = React.useCallback(
    (idx:any) => () => setCurrentPhotoIdx(idx),
    []
  );
  const photos: [] = React.useMemo<any>(
    () =>
    thumbsToShow.map((photoUrl:any, idx:any) => {
        const key = `${photoUrl}_${idx}`;
        let className = "slide__content";
        if (currentPhotoIdx === idx) {
          className += " --current-selected";
        }
        return (
          <div
            key={key}
            className={className}
            onClick={onClickPhotoHandler(idx)}
          >
            <img src={photoUrl} onError={(e: any) => {
              e.target.src = placeHolder;
              }}
              alt="property"/>
          </div>
        );
      }),
    [onClickPhotoHandler, currentPhotoIdx]
  );


  function setImageDetails() {
    setImageDetail(photoToShow);
    showImagePopup(true);
  }

  function closeImagePopup(value:boolean=true) {
    if(value) {
      setImageDetail(null);
    }
    showImagePopup(false);
  }

  return (
      <>

        <div className="App">
            <div className="photos-gallery">
                {propertyOnDiscount && (
                        <div className="sale-container">
                          <div className="sale-image">
                            <div className="sale-txt">SALE</div>
                          </div>
                        </div>
                )}
                <PhotosCarousel
                className="photo-wrapper"
                currentSlideIdx={currentPhotoIdx}
                >
                    {photos}
                </PhotosCarousel>
                {
                    photos.length > 1 ?
                    <>
                        <PhotosCarousel
                            className="thumbnails-wrapper"
                            config={thumbnailsCarouselConfig}
                            currentSlideIdx={currentPhotoIdx}
                        >
                            {photos}
                        </PhotosCarousel>
                        {
                            photos.length > 1
                                ?
                                <div className="showallgallery" onClick={() => setImageDetails()}>Show All</div>
                                :
                            null
                        }
                    </>
                    :
                    <></>  
                }
                
            </div>
        </div>

        <ImageModel
            detail={imageDetail}
            show={imagePopup}
            handleClose={closeImagePopup}
            handleOpen={setImageDetails}
        />
      
      </>
    
  );
}
