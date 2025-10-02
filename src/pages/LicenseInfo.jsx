import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const LicenseInfo = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        License Information
      </Typography>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Personal Use License
        </Typography>
        <Typography variant="body1">
          All free wallpapers on this platform are available for personal use. You can download them and use them as your desktop or mobile background, on your personal blog, or for non-commercial social media posts. However, you may not redistribute, sell, or use them for any commercial purposes without explicit permission.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Commercial Use License
        </Typography>
        <Typography variant="body1">
          For commercial use of our wallpapers, you must purchase a commercial license. This license grants you the right to use the wallpaper in your commercial projects, such as websites, marketing materials, and advertisements. Each purchased wallpaper comes with its own license agreement, so be sure to review the terms before use.
        </Typography>
        <Typography variant="body1" className="mt-4">
          If you have any questions about our licensing, please <a href="/contact-us">contact us</a>.
        </Typography>
      </Box>
    </Container>
  );
};

export default LicenseInfo;
