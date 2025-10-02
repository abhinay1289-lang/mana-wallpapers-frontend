import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DMCA = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        DMCA Policy
      </Typography>

      <Box className="mb-8">
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Reporting Copyright Infringement
        </Typography>
        <Typography variant="body1">
          If you believe that any content on our service infringes upon your copyright, you may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing:
        </Typography>
        <ul>
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled.</li>
          <li>Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
        </ul>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" className="font-bold mb-4">
          Counter-Notification
        </Typography>
        <Typography variant="body1">
          If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to the Copyright Agent:
        </Typography>
        <ul>
          <li>Your physical or electronic signature.</li>
          <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
          <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
          <li>Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the federal court in the judicial district in which you are located, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
        </ul>
      </Box>
    </Container>
  );
};

export default DMCA;
