import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';

const ProductCard = ({ product }) => {
  const options = {
    size: "large",
    value: product.ratings || 0, // Ensure value is defined
    isHalf: true,
  };

  // Safely access the image URL
  const imageUrl = product.images && product.images[0] ? product.images[0].url : 'path/to/fallback-image.jpg'; // Fallback to a default image

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={imageUrl} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} /> <span className='productCardSpan'>({product.numOfReviews || 0} Reviews)</span> {/* Ensure numOfReviews is defined */}
      </div>
      <span>{`Rs ${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
