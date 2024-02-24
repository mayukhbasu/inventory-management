import React, { useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useDispatch } from '../../hooks/useDispatch';
import { userInfo } from '../../redux/actions/user-info-actions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { AppBar, Toolbar, Typography, Button, Theme, IconButton, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
}));
const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  const handleProfileMenuOpen = () => {

  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          My App
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">About</Button>
        <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </MenuItem>
        <Button color="inherit">{userDetails.data.name}</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;