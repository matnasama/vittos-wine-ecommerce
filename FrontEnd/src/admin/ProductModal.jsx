// src/admin/ProductModal.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function ProductModal({ open, handleClose, handleSave, producto, setProducto }) {
  const isEdit = !!producto?.id;
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación para campos numéricos
    if (name === 'precio' || name === 'stock') {
      if (value && isNaN(value)) return; // No actualizar si no es número
    }
    
    setProducto({ ...producto, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!producto.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!producto.precio || isNaN(producto.precio)) newErrors.precio = 'Precio debe ser un número';
    if (!producto.stock || isNaN(producto.stock)) newErrors.stock = 'Stock debe ser un número';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = () => {
    if (validate()) {
      handleSave();
    }
  };

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'descripcion', label: 'Descripción', type: 'text' },
    { name: 'precio', label: 'Precio', type: 'number' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'categoria', label: 'Categoría', type: 'text' },
    { name: 'imagen', label: 'URL de la Imagen', type: 'text' }
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? 'Editar producto' : 'Agregar nuevo producto'}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            margin="dense"
            label={field.label}
            name={field.name}
            type={field.type}
            fullWidth
            value={producto?.[field.name] || ''}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained">
          {isEdit ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}