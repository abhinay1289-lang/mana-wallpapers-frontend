import React from 'react';
import WallpaperCard from './WallpaperCard';

const WallpaperList = ({ wallpapers }) => {
  return (
    <div className="flex flex-wrap justify-center p-4">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
};

export default WallpaperList;
