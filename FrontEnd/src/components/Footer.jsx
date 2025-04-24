// src/components/Footer.jsx
import React from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Footer = () => {
  return (
    <Box sx={{ mt: 4, p: 4, backgroundColor: "#f5f5f5", textAlign: "center" }}>
      <Typography
        color="#424242"
        fontFamily="libre-baskerville-regular"
        variant="h6"
        gutterBottom
      >
        Acerca de nosotros
      </Typography>
      <Typography
        color="#424242"
        fontFamily="libre-baskerville-regular"
        variant="body2"
        gutterBottom
      >
        Contacto | FAQ | Términos y Condiciones
      </Typography>
      <Grid container justifyContent="center" spacing={2} mt={1}>
        <Grid item>
          <IconButton color="inherit" href="https://www.facebook.com/" target="_blank">
            <FacebookIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="inherit" href="https://www.instagram.com/" target="_blank">
            <InstagramIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="inherit" href="mailto:lujanlucasariel@gmail.com">
            <EmailIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="inherit" href="https://wa.me/5491164978342" target="_blank">
            <WhatsAppIcon style={{ color: "#424242" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
