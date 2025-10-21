const getImage = (categoryName) => {
  const imageMap = {
    // 2D Categories
    animals:
      "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Animals/animals.png",
    anime:
      "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Anime/gaming.png",
    arts: "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Arts/spiritual.png",
    beiges: "",
    cate: "",
    sports: "",
    technology:
      "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Technology/3d-category.png",
    transportation: "",
    travel:
      "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Travel/virtual.png",
    nature:
      "https://roygltyllsnzhanbpswm.supabase.co/storage/v1/object/public/mana-wallpapers/Nature/nature.png",
  };

  const normalizedName = categoryName.toLowerCase().replace(/ /g, "-");
  // Find matching category or return default image
  return Object.entries(imageMap).find(([key]) =>
    normalizedName.includes(key)
  )?.[1];
};

export default getImage;
