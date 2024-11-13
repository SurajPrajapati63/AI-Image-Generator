import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setImageUrl] = useState(default_image);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt === "") {
      alert("Please enter a description.");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "512x512",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const dataArray = data.data;

      if (dataArray && dataArray.length > 0) {
        setImageUrl(dataArray[0].url);
      } else {
        console.error("No image data received");
        setImageUrl(default_image); // Use default image if no result
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("There was an error generating the image.");
      setImageUrl(default_image); // Reset to default image on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">AI Image <span>Generator</span></div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url} alt="Generated" />
        </div>
        {loading && (
          <div className="loading">
            <div className="loading-bar-full"></div>
            <div className="loading-text">Loading...</div>
          </div>
        )}
      </div>
      <div className='search-box'>
        <input
          type="text"
          ref={inputRef}
          className='search-input'
          placeholder='Describe what you want to see'
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
