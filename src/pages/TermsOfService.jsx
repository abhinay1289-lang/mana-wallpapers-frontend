import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Terms of Service
      </Typography>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1">
          By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our service.
        </Typography>
      </Box>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          2. User Conduct
        </Typography>
        <Typography variant="body1">
          You are responsible for your use of the service and for any content you provide. You agree not to upload or share any content that is illegal, infringing, or otherwise harmful.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          3. Intellectual Property
        </Typography>
        <Typography variant="body1">
          You retain ownership of any intellectual property rights that you hold in the content you upload. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
