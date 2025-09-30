import { useState } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Abstract Colors', price: 12.99, image: 'https://source.unsplash.com/random/800x600?abstract' },
    { id: 2, name: 'Mountain Landscape', price: 15.99, image: 'https://source.unsplash.com/random/800x600?landscape' },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map(item => (
            <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4">${item.price}</p>
                <button onClick={() => removeFromWishlist(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
