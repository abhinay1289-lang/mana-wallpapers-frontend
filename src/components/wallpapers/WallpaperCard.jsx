import React from 'react';
import { Link } from 'react-router-dom';

const WallpaperCard = ({ wallpaper }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 m-2">
      <Link to={`/wallpaper/${wallpaper.id}`}>
        <img src={wallpaper.thumbnailUrl} alt={wallpaper.title} className="w-full h-auto object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-semibold">{wallpaper.title}</h3>
        <p className="text-gray-500">{wallpaper.artist}</p>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <span className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">${wallpaper.price}</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;
