import { useState } from 'react';
import { InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <InputBase
        placeholder="Search…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-gray-600 bg-gray-100 rounded-full px-4 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <IconButton type="submit" size="small" className="absolute right-1 top-1/2 -translate-y-1/2">
        <SearchIcon />
      </IconButton>
    </form>
  );
};

export default Search;