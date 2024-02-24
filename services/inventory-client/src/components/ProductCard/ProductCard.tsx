import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import React, { FC } from 'react';

export type ProductInfo = {
  name: string,
  price: number,
  description: string
}

type ProductCardProps = {
  name: string,
  price: number,
  description: string,
  quantity: number,
  onSelectProduct: (product: ProductInfo, quantity: number) => void
}

const ProductCard: FC<ProductCardProps> = ({name, price, description, quantity, onSelectProduct}) => {

  const handleDecrement = () => {
    if(quantity > 0)
    onSelectProduct({name, price, description}, quantity - 1);
  }

  const handleIncrement = () => {
    onSelectProduct({name, price, description}, quantity + 1);
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {price}$
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
      <Button size="small" onClick={handleDecrement}>-</Button>
        <Typography>{quantity}</Typography>
        <Button size="small" onClick={handleIncrement}>+</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;