const getImage = (categoryName) => {
  const imageMap = {
    // 2D Categories
    nature : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Nature/nature.png',
    gaming : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Gaming%20&%20Anime/gaming.png',
    animals:'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Animals/animals.png',
    religious : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Religious/spiritual.png',
    aesthetic:'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Aesthetic%20Trends/Aesthetic.png',
    technology:'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Technology/technology.png',
    fan :'',
    seasonal : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/Seasonal/seasonal.png',
    illustration: 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/Illustration%20&%20Art/illustration-and-art-wallpaper.png',
    photography: 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/Photography/photography-wallpaper.png',
    typography: 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/Typography/typography-wallpaper.png',
    patterns: 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/Patterns%20&%20Abstract/patterns-and-abstract-wallpaper.png',
    cartoons: 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/Cartoons%20&%20Comics/cartoons-and-comics-wallpaper.png',
    '3d-model' : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/3D-Wallpapers/3D%20Models/3d-models.png',
    architectural:'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/3D-Wallpapers/Architectural%20Visualization/architectural-visualization.png',
    rendered : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/3D-Wallpapers/Rendered%20Art/rendered-art.png',
    virtual : 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/3D-Wallpapers/Virtual%20Photography/virtual.png',
    // Main Categories
    '2d': 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/2D-Wallpapers/2d-category.png',
    '3d': 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/3D-Wallpapers/3d-category.png',
    'other popular': 'https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Other-Popular-Categories/nature-wallpaper.png'
  };

  const normalizedName = categoryName.toLowerCase().replace(/ /g, "-");
  
  // Find matching category or return default image
  return Object.entries(imageMap).find(([key]) => normalizedName.includes(key))?.[1] || imageMap.nature;
};

export default getImage;