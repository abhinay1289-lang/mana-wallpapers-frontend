import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Privacy Policy
      </Typography>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Information We Collect
        </Typography>
        <Typography variant="body1">
          We collect information that you provide to us directly, such as when you create an account, upload a wallpaper, or contact us. This may include your name, email address, and any other information you choose to provide.
        </Typography>
        <Typography variant="body1" className="mt-4">
          We also automatically collect certain information when you use our service, such as your IP address, browser type, operating system, and usage data.
        </Typography>
      </Box>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          How We Use Your Information
        </Typography>
        <Typography variant="body1">
          We use the information we collect to provide, maintain, and improve our services, to personalize your experience, to communicate with you, and to protect the security of our platform.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Your Rights
        </Typography>
        <Typography variant="body1">
          You have the right to access, correct, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
