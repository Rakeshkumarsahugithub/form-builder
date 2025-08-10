import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>
              Create Form
            </Link>
            <Link to="/preview" style={{ color: 'white', textDecoration: 'none' }}>
              Preview
            </Link>
            <Link to="/myforms" style={{ color: 'white', textDecoration: 'none' }}>
              My Forms
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;