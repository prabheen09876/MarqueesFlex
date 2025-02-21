import { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    className,
    fallbackSrc = '/placeholder.png' // Add a placeholder image to your public folder
}) => {
    const [error, setError] = useState(false);

    return (
        <img
            src={error ? fallbackSrc : src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default ImageWithFallback; 