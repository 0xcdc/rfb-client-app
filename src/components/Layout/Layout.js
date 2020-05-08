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

// external-global styles must be imported in your JS.
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';

function cancelPopup(e) {
  e.preventDefault();
}

export default function Layout({ children }) {
  useStyles(bootstrap, s, normalizeCss);

  return (
    <div className="container" onContextMenu={cancelPopup}>
      <Header />
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
