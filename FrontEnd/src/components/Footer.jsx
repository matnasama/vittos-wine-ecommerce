// src/components/Footer.jsx
import React from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Footer = () => {
  return (
    <Box sx={{ 
      mt: 4, 
      p: 4, 
      backgroundColor: "#f5f5f5", 
      textAlign: "center",
      transition: 'all 0.3s ease-in-out'
    }}>
      <Typography
        color="#424242"
        fontFamily="libre-baskerville-regular"
        variant="h6"
        gutterBottom
        sx={{
          transition: 'all 0.3s ease-in-out'
        }}
      >
        Acerca de nosotros
      </Typography>
      <Typography
        color="#424242"
        fontFamily="libre-baskerville-regular"
        variant="body2"
        gutterBottom
        sx={{
          transition: 'all 0.3s ease-in-out'
        }}
      >
        Contacto | FAQ | Términos y Condiciones.
      </Typography>
      <Grid 
        container 
        justifyContent="center" 
        spacing={2} 
        mt={1}
        sx={{
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Grid item>
          <IconButton 
            color="inherit" 
            href="https://www.facebook.com/" 
            target="_blank"
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <FacebookIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton 
            color="inherit" 
            href="https://www.instagram.com/" 
            target="_blank"
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <InstagramIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton 
            color="inherit" 
            href="mailto:lujanlucasariel@gmail.com"
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <EmailIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton 
            color="inherit" 
            href="https://wa.me/5491164978342" 
            target="_blank"
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <WhatsAppIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
