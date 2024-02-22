import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';


import { useDispatch } from '../../hooks/useDispatch';
import { fetchProducts } from '../../redux/actions/fetch-products-actions';
import { RootState } from '../../redux/reducers';
import ProductCard from '../../components/ProductCard/ProductCard';
import styled from '@emotion/styled';


const CustomGrid = styled(Grid)({
  paddingTop: '40px',
  paddingLeft: '40px',
  paddingRight:'40px',
});
const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.data);

  useEffect(() => {
    dispatch(fetchProducts(1))
  }, [dispatch])
  return (
   <CustomGrid container  spacing={2}>
    {
      
        products.map((product, key) => (
          <Grid item key={key} xs={12} sm={6} md={9} lg={4}>
            <ProductCard key={key} name={product.name} price={parseFloat(product.price)} description={product.description}/>
          </Grid>
      ))
      
      
    }
   </CustomGrid>
  );
};

export default HomePage;