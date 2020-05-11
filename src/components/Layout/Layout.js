/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import bootstrap from '../../../scss/custom.scss';
import s from './Layout.css';

function cancelPopup(e) {
  e.preventDefault();
}

export default function Layout({ children }) {
  useStyles(bootstrap, s, normalizeCss);

  return (
    <Container fluid="xl" onContextMenu={cancelPopup}>
      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
