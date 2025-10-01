import React, { useState, useEffect } from 'react';
import { wallpaperService } from '../services/wallpaperService';
import WallpaperList from '../components/wallpapers/WallpaperList';
import { Button, Select, MenuItem, Input, CircularProgress } from '@mui/material';

const WallpaperManagement = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [filteredWallpapers, setFilteredWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const data = await wallpaperService.getAllWallpapers();
        setWallpapers(data);
        setFilteredWallpapers(data);
        const uniqueCategories = [...new Set(data.map(wp => wp.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallpapers:', error);
        setLoading(false);
      }
    };
    fetchWallpapers();
  }, []);

  useEffect(() => {
    let filtered = wallpapers;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(wp => wp.category === selectedCategory);
    }
    if (selectedPrice !== 'all') {
      if (selectedPrice === 'free') {
        filtered = filtered.filter(wp => wp.price === 0);
      } else if (selectedPrice === 'paid') {
        filtered = filtered.filter(wp => wp.price > 0);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(wp =>
        wp.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredWallpapers(filtered);
  }, [selectedCategory, selectedPrice, searchTerm, wallpapers]);

  const handleDelete = async wallpaperId => {
    try {
      await wallpaperService.deleteWallpaper(wallpaperId);
      setWallpapers(wallpapers.filter(wp => wp._id !== wallpaperId));
    } catch (error) {
      console.error('Error deleting wallpaper:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Wallpaper Management</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = '/admin/upload-wallpaper')}
        >
          Add Wallpaper
        </Button>
      </div>
      <div className="flex gap-4 mb-4">
        <Select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="min-w-[200px]"
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedPrice}
          onChange={e => setSelectedPrice(e.target.value)}
          className="min-w-[120px]"
        >
          <MenuItem value="all">All Prices</MenuItem>
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
        </Select>
        <Input
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>
      <WallpaperList wallpapers={filteredWallpapers} onAction={handleDelete} actionLabel="Delete" />
    </div>
  );
};

export default WallpaperManagement;
