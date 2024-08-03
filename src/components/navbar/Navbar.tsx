'use client'
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '#fff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Image
          src="/assets/logo.png"
          alt="Turing Technologies"
          width={isMobile ? 170 : 300}
          height={isMobile ? 20 : 40}
          style={{ marginRight: '10px' }}
        />
        {isLoggedIn && (
          <Button variant="contained" color="primary" sx={{ padding: { xs: "2px 8px", sm: "4px 16px" }, textTransform: "none" }} onClick={handleLogout}>
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
