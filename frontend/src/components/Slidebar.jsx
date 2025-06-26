import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';

function Slidebar() {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: '1550px', margin: '0 auto' }}>
      {/* ✅ Indicators ขีดกลมด้านล่าง */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="../../public/images/148539-1024x768.jpg"
            className="d-block w-100"
            alt="Slide 1"
            style={{ objectFit: 'cover', height: '400px' }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="../../public/images/1r1uli.jpg"
            className="d-block w-100"
            alt="Slide 2"
            style={{ objectFit: 'cover', height: '400px' }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="../../public/images/thaimetal-product-cover-slide.jpg.jpg"
            className="d-block w-100"
            alt="Slide 3"
            style={{ objectFit: 'cover', height: '400px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Slidebar;
