import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Badge
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = React.memo(({ variant, onAddToCart, cart }) => {
  // Usar directamente el nombre de la imagen_url
  const getOptimizedImageUrl = (imageName) => {
    if (!imageName) return '';
    return `/products/optimized/${imageName}`;
  };

  return (
    <Card sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      borderRadius: 2,
      maxWidth: '230px',
      mx: 'auto',
      width: '100%'
    }}>
      <CardMedia
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: '135px',
          p: 1,
          background: 'transparent'
        }}
      >
        <img
          src={getOptimizedImageUrl(variant.imagen_url)}
          alt={variant.nombre}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
            margin: 'auto'
          }}
          loading="lazy"
        />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {variant.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {variant.categoria}
        </Typography>
        <Typography variant="body1">${variant.precio}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", px: 2, pb: 2 }}>
        <Badge badgeContent={cart.find(item => item.id === variant.id)?.quantity || 0} color="error">
          <IconButton onClick={() => onAddToCart(variant)}>
            <AddShoppingCartIcon />
          </IconButton>
        </Badge>
      </CardActions>
    </Card>
  );
});

export default ProductCard; 