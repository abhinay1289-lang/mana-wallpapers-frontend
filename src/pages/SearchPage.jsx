import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallpapers } from '../features/thunks/wallpapersThunks.js';
import WallpaperList from '../components/wallpapers/WallpaperList.jsx';
import { Container, Typography, Box } from '@mui/material';
import Loading from '../components/common/Loading';

const SearchPage = () => {
  const { searchTerm } = useParams();
  const dispatch = useDispatch();
  const { wallpapers, loading, error } = useSelector((state) => state.wallpapers);

  useEffect(() => {
    // Dispatch the fetchWallpapers thunk with the search term
    dispatch(fetchWallpapers({ searchTerm }));
  }, [dispatch, searchTerm]);

  return (
    <Container maxWidth="xl" className="py-12">
      <Box className="text-center mb-8">
        <Typography variant="h4" component="h1" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
          Search Results for "{searchTerm}"
        </Typography>
      </Box>
      
      {loading ? (
        <Loading />
      ) : error ? (
        <Typography color="error" className="text-center">
          {error.message || 'An error occurred while fetching wallpapers.'}
        </Typography>
      ) : wallpapers.length > 0 ? (
        <WallpaperList wallpapers={wallpapers} />
      ) : (
        <Typography className="text-center text-gray-400">
          No wallpapers found for your search.
        </Typography>
      )}
    </Container>
  );
};

export default SearchPage;
