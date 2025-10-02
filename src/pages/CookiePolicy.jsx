import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CookiePolicy = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Cookie Policy
      </Typography>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          What Are Cookies?
        </Typography>
        <Typography variant="body1">
          Cookies are small text files that are stored on your device when you visit a website. They are used to remember your preferences and to help us understand how you use our service.
        </Typography>
      </Box>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          How We Use Cookies
        </Typography>
        <Typography variant="body1">
          We use cookies to personalize your experience, to provide social media features, and to analyze our traffic. We also share information about your use of our site with our social media, advertising, and analytics partners.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Your Choices
        </Typography>
        <Typography variant="body1">
          You can control the use of cookies at the individual browser level. If you reject cookies, you may still use our site, but your ability to use some features or areas of our site may be limited.
        </Typography>
      </Box>
    </Container>
  );
};

export default CookiePolicy;
