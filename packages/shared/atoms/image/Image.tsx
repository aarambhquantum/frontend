import React from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt = 'icon', className, fallbackSrc }) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
};

export default Image;