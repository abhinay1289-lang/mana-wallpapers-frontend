import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpCenter = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Help Center
      </Typography>

      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How do I search for wallpapers?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can use the search bar at the top of the page to search for wallpapers by keywords, colors, or categories. You can also browse through our curated collections on the homepage.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How do I download a wallpaper?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Once you've found a wallpaper you like, click on it to view the details. On the product page, you'll see a "Download" button. Click it to save the wallpaper to your device. Some high-quality wallpapers might require a purchase.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">What resolutions are the wallpapers available in?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer a wide range of resolutions to fit all your devices, from mobile phones to ultra-wide monitors. The available resolutions for each wallpaper are listed on its product page.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Can I use these wallpapers for commercial projects?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our license terms vary depending on the wallpaper. Please see our <a href="/license-info">License Info</a> page for detailed information on commercial use.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How do I create an account?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                You can create a free account by clicking the "Sign Up" button in the top right corner. An account allows you to save your favorite wallpapers to a wishlist, manage your downloads, and more.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How can I contact customer support?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you have any questions or issues, you can reach out to us through our <a href="/contact-us">Contact Us</a> page. We're here to help!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default HelpCenter;
