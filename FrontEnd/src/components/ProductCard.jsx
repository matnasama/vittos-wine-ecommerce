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
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const ProductCard = React.memo(({ variant, onAddToCart, onZoom, cart, navigate }) => {
  // Función para obtener la URL de la imagen optimizada
  const getOptimizedImageUrl = (imageName) => {
    const baseName = imageName.split('.')[0];
    return `/products/optimized/${baseName}.webp`;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
      <CardMedia
        component="img"
        image={getOptimizedImageUrl(variant.image)}
        alt={variant.type}
        height="200"
        loading="lazy"
        sx={{ objectFit: "contain", p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {variant.type}
        </Typography>
        <Typography variant="body1">${variant.price}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <IconButton onClick={() => onZoom(variant.image)} title="Ver imagen">
          <SearchIcon />
        </IconButton>
        <Badge badgeContent={cart.find(item => item.id === variant.id)?.quantity || 0} color="error">
          <IconButton onClick={() => onAddToCart(variant)}>
            <AddShoppingCartIcon />
          </IconButton>
        </Badge>
        <IconButton onClick={() => navigate("/cart")} color="primary" title="Ir al carrito">
          <ShoppingCartOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
});

export default ProductCard; 