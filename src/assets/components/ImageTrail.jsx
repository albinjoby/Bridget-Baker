import React, { useEffect, useRef, useState } from "react";

const ImageTrail = () => {
  const containerRef = useRef(null);
  const last = useRef({ x: 0, y: 0 });
  const [globalIndex, setGlobalIndex] = React.useState(0);
  const [Threshold, setThreshold] = useState(100);
  const totalCount = 23;

  useEffect(() => {
    const images = containerRef.current.querySelectorAll(".image");

    const distanceFromLast = (x, y) => {
      return Math.hypot(x - last.current.x, y - last.current.y);
    };

    const activate = (image, x, y) => {
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;
      image.dataset.status = "active";
      last.current = { x, y };
    };

    const handleMouseMove = (e) => {
      if (distanceFromLast(e.clientX, e.clientY) > Threshold) {
        const index = globalIndex % images.length;
        const lead = images[index];
        const tail =
          images[(globalIndex - 5 + images.length) % images.length];

        activate(lead, e.clientX, e.clientY);

        if (tail) {
          tail.dataset.status = "inactive";
        }

        setGlobalIndex(prev => prev + 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [globalIndex, Threshold]);

  // Create the 23 images
  const imageElements = Array.from({ length: 23 }).map((_, i) => (
    <img
      key={i}
      className="image"
      data-index={i}
      data-status="inactive"
      src={`img${i + 1}.jpg.avif`}
      alt={`img${i + 1}`}
    />
  ));

  return (
    <div className="font-helvetica">

      <section
        ref={containerRef}
        className="relative h-[100vh] overflow-hidden"
      >
        {imageElements}
      </section>

      <div className="bg-white w-[100vw] h-10 absolute bottom-0 left-0 z-50 flex items-center justify-between p-5 ">
        <span>Bridget Baker</span>
        <span className="hidden md:block">Featured, iPhone, Film, Info</span>
        <div className="hidden md:block">
            <span>Threshold:</span>
          <button onClick={() => setThreshold(prev => Math.max(20, prev - 50))}>-</button>
          <span className="px-2 font-mono w-[40px] inline-block text-center">{Threshold}</span>
          <button onClick={() => setThreshold(prev => Math.min(200, prev + 50))}>+</button>
        </div>
        <span className="font-mono w-[60px] inline-block text-right">
          {(globalIndex % totalCount) + 1}/{totalCount}
        </span>
      </div>

    </div>
  );
};

export default ImageTrail;
