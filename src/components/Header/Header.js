import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook } from '@fortawesome/free-solid-svg-icons';
import Link from '../Link';
import s from './Header.css';

export default function Header() {
  useStyles(s);
  return (
    <div>
      <Link to="/">
        <Button>
          Home <FontAwesomeIcon icon={faHome} />
        </Button>
      </Link>
      <Link to="/report">
        <Button>
          Reports <FontAwesomeIcon icon={faBook} />
        </Button>
      </Link>
      <br />
      <Link to="/">
        <img
          src="/default-logo.png"
          className="img-responsive"
          alt="Renewal Food Bank Logo"
        />
      </Link>
    </div>
  );
}
