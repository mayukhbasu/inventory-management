import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';


import { useDispatch } from '../../hooks/useDispatch';
import { fetchProducts } from '../../redux/actions/fetch-products-actions';
import { RootState } from '../../redux/reducers';
import ProductCard, { ProductInfo } from '../../components/ProductCard/ProductCard';
import styled from '@emotion/styled';
import { Button } from '@mui/material';


const CustomGrid = styled(Grid)({
  paddingTop: '40px',
  paddingLeft: '40px',
  paddingRight:'40px',
});
const HomePage = () => {
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});
  const currentUser = useSelector((state: RootState) => state.userInfo.data.googleId);
  const [currentPage, setCurrentPage] = useState(1);
  const products = useSelector((state: RootState) => state.products.data);

  const handleSelectProduct = (product: ProductInfo, quantity: number) => {
    setSelectedProducts(prevState => ({
      ...prevState,
      [product.name]: quantity
    }));
  };

  useEffect(() => {
    dispatch(fetchProducts(currentPage))
  }, [dispatch, currentPage]);


  const nextPage = () => setCurrentPage(prevPage => prevPage + 1);
  const prevPage = () => setCurrentPage(prevPage => prevPage - 1);

  const addToCart = () => {
    console.log(JSON.stringify({selectedProducts, currentUser}));
  }

  return (
    <>
      <Grid item xs={10} style={{ textAlign: 'right' , marginTop:'20px', marginRight:'20px'}}>
          <Button variant="contained" color="secondary" onClick={addToCart}>
            Add To cart
          </Button>
        </Grid>
       <CustomGrid container  spacing={2}>
    {
      
        products && products.map((product, key) => (
          <Grid item key={key} xs={12} sm={6} md={9} lg={3}>
            <ProductCard key={key} name={product.name} quantity={selectedProducts[product.name] || 0}
            price={parseFloat(product.price)} description={product.description} onSelectProduct={handleSelectProduct}/>
          </Grid>
      ))
      
      
      }
        </CustomGrid>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={prevPage}>Previous</Button>
        <Button onClick={nextPage} disabled={currentPage === 9}>Next</Button>
      </div>
    </>
  
  );
};

export default HomePage;