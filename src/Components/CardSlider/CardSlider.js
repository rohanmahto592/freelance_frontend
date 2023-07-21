import React from "react";
import "./CardSlider.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
const CardSlider = (props) => {
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 260;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 260;
  };

  return (
    <div id="main-slider-container">
      <div id="slider">
        {props.slides.map((slide, index) => {
          return (
            <div
              class="card"
              style={{
                flex: 1,
                flexShrink: 0,
                flexBasis: "250px",
              }}
            >
              <img
                class="card-img-top"
                src={slide.image || "https://picsum.photos/200/300"}
                alt={slide.title}
                style={{ width: "100%", height: "200px" }}
              />
              <div class="card-body">
                <h5 class="card-title">{slide.title}</h5>
                <p class="card-text">{slide.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div
        id="slider-icon"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "10px",
        }}
      >
        <MdChevronLeft
          size={40}
          className="slider-icon-arrow left"
          onClick={slideRight}
        />
        <MdChevronRight
          size={40}
          className="slider-icon-arrow right"
          onClick={slideLeft}
        />
      </div>
    </div>
  );
};
export default CardSlider;
