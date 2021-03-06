import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import s from './Visits.css';

const numberOfVisitsToShow = 8;

class Visits extends Component {
  static propTypes = {
    visits: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    onDeleteVisit: PropTypes.func.isRequired,
  };

  render() {
    const visitsToShow = this.props.visits
      .map(visit => {
        const dateparts = visit.date.split('-');
        // month is 0 based
        dateparts[1] -= 1;
        const date = new Date(...dateparts);
        return {
          id: visit.id,
          date,
        };
      })
      .sort((l, r) => {
        const cmp = r.date - l.date;
        return cmp;
      })
      .slice(0, numberOfVisitsToShow);

    return (
      <Table hover striped size="sm">
        <thead>
          <tr>
            <th colSpan="2">Visits</th>
          </tr>
        </thead>
        <tbody>
          {visitsToShow.map(visit => {
            return (
              <tr key={`visit-${visit.id}`}>
                <td>
                  {visit.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className={s.xIconColumn}>
                  <Button
                    variant="link"
                    className={s.xButton}
                    size="sm"
                    onClick={() => {
                      this.props.onDeleteVisit(visit.id);
                    }}
                  >
                    <FontAwesomeIcon className={s.xIcon} icon={faTimesCircle} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default withStyles(s)(Visits);
