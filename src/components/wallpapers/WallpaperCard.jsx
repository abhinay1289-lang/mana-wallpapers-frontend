import React from 'react';
import { Link } from 'react-router-dom';

const WallpaperCard = ({ wallpaper }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/wallpaper/${wallpaper.id}`}>
        <img src={wallpaper.thumbnailUrl} alt={wallpaper.title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{wallpaper.title}</h3>
        <p className="text-gray-500">{wallpaper.artist}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">${wallpaper.price}</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;
