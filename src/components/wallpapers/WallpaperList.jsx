import React from 'react';
import WallpaperCard from './WallpaperCard';

const WallpaperList = ({ wallpapers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
};

export default WallpaperList;
