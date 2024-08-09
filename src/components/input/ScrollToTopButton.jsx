import React, { useState, useEffect } from "react";
import "./ScrollToTopButton.scss";
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`scrollToTopButton ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      ^
    </button>
  );
};

export default ScrollToTopButton;
