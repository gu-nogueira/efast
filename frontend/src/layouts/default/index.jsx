import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Content } from './styles';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

function DefaultLayout({ children, url }) {
  return (
    <Wrapper>
      <Header url={url} />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
}

/*
 *  propTypes definition
 */

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DefaultLayout;
