import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Carousel } from "react-bootstrap";

export default function ImageModel({
  detail,
  show,
  handleClose,
  handleOpen,
}: {
  detail: string[];
  show: boolean;
  handleClose: (param?: boolean) => void; // Explicit boolean type
  handleOpen: VoidFunction
}) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Open carousel modal and set index
  const openCarousel = (index: number) => {
    setSelectedIndex(index);
    setShowCarousel(true);
    handleClose(false); // Close the original modal
  };

  // Close carousel and return to the main modal
  const handleCloseCarousel = () => {
    setShowCarousel(false);
  };

  // Handle "View All Photos" click event
  const handleViewAll = () => {
    setShowCarousel(false); // Close carousel
    handleOpen(); // Reopen original modal
  };

  return (
    <>
      {/* Original Image Modal */}
      <Modal
        show={show}
        onHide={() => handleClose(false)} // Close modal
        backdrop="static"
        keyboard={false}
        dialogClassName="model-common gallery-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="product-image-modal">
            {detail?.length > 0 ? (
              detail.map((data, index) => (
                <div
                  className="product-image-modal-card"
                  key={index}
                  onClick={() => openCarousel(index)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={data} alt="Img" />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Carousel Modal */}
      <Modal
        show={showCarousel}
        onHide={handleCloseCarousel}
        backdrop="static"
        keyboard={false}
        dialogClassName="model-common gallery-modal _owl_custome_slider"
      >
        <Modal.Header closeButton>
          {/* "View All Photos" Button */}
          <div className="view-all-photo-button"
            onClick={handleViewAll} // Handle the click
          >
            VIEW ALL PHOTOS
          </div>
        </Modal.Header>
        <Modal.Body>
          {detail?.length > 0 && (
            <>

              <Carousel
                activeIndex={selectedIndex}
                onSelect={(selected) => setSelectedIndex(selected)}
                interval={null} // Disable auto-slide
              >
                {detail.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={image} alt={`Slide ${index}`} />
                    <p className="_p_num">{index + 1}/{detail.length}</p>
                  </Carousel.Item>
                ))}
              </Carousel>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
