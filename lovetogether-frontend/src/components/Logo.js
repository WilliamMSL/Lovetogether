import React, { forwardRef } from 'react';
import styled from 'styled-components';
import LogoImage from '../images/LoveTogether_logo.svg';

const LogoContainer = styled.img`
  width: 100%; 
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
`;

const Logo = forwardRef((props, ref) => {
  return <LogoContainer ref={ref} src={LogoImage} alt="Logo" />;
});

export default Logo;
