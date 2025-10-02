import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const ContactUs = () => {
  return (
    <Container maxWidth="sm" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Contact Us
      </Typography>

      <Typography variant="body1" className="text-center mb-8">
        Have a question or need assistance? Fill out the form below or email us at <a href="mailto:support@example.com">support@example.com</a>.
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          className="mb-4"
        />
        <TextField
          fullWidth
          label="Your Email"
          variant="outlined"
          className="mb-4"
        />
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          multiline
          rows={6}
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="py-3"
        >
          Send Message
        </Button>
      </Box>
    </Container>
  );
};

export default ContactUs;
