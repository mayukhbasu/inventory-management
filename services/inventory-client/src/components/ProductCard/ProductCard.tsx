import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import React, { FC } from 'react';

type ProductInfo = {
  name: string,
  price: number,
  description: string
}

const ProductCard: FC<ProductInfo> = ({name, price, description}) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {price}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;