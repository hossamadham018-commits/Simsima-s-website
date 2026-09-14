import { useState } from 'react';

export default function FoodImage({ src, alt }) {
  const [failedSource, setFailedSource] = useState(null);
  if (!src || failedSource === src) return <div className="shop-image-placeholder"><img src="/Logo.jpeg" alt="" /><span>{alt}</span></div>;
  return <img src={src} alt={alt} loading="lazy" className="shop-food-image" onError={() => setFailedSource(src)} />;
}
