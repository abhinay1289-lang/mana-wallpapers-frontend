import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const RefundPolicy = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Refund Policy
      </Typography>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Digital Products
        </Typography>
        <Typography variant="body1">
          Due to the nature of digital products, we do not offer refunds on wallpaper purchases once the download has been initiated. All sales are final. We encourage you to review the product details and preview images carefully before making a purchase.
        </Typography>
        <Typography variant="body1" className="mt-4">
          If you experience any issues with your download, such as a corrupt file or an incorrect image, please <a href="/contact-us">contact our support team</a> within 7 days of your purchase. We will be happy to assist you and provide a replacement file.
        </Typography>
      </Box>
    </Container>
  );
};

export default RefundPolicy;
