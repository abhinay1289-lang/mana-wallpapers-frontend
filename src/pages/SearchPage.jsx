import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchWallpapers } from '../services/wallpaperService';
import WallpaperList from '../components/wallpapers/WallpaperList.jsx';
import { Container, Typography } from '@mui/material';
import Loading from '../components/common/Loading';

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        setLoading(true);
        const data = await searchWallpapers(searchTerm);
        setWallpapers(data);
      } catch (error) {
        console.error('Error searching wallpapers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, [searchTerm]);

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" component="h1" className="text-2xl font-bold mb-6 text-gradient">
        Search Results for "{searchTerm}"
      </Typography>
      {loading ? <Loading /> : <WallpaperList wallpapers={wallpapers} />}
    </Container>
  );
};

export default SearchPage;
