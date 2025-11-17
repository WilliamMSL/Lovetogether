import React from 'react';
import NavbarLeft from './navbarlist';
import NavbarRight from './navbarright';

const Navbar = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1000000 }}>
      <NavbarLeft />
      <NavbarRight />
    </div>
  );
};

export default Navbar;
