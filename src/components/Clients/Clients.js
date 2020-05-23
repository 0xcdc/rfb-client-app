import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Badge, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Link from '../Link';
import s from './Clients.css';

class Clients extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        householdSize: PropTypes.number,
      }),
    ).isRequired,
    onClientSelect: PropTypes.func.isRequired,
    showSelection: PropTypes.bool.isRequired,
    selectedClientId: PropTypes.number.isRequired,
  };

  render() {
    function tooltip(note) {
      return <Tooltip id="tooltip">{note}</Tooltip>;
    }

    return (
      <Table hover striped size="sm">
        <tbody>
          {this.props.clients.map((client, index) => {
            const selectedRow =
              this.props.showSelection &&
              client.id === this.props.selectedClientId;
            return (
              <tr key={client.id} className={selectedRow ? 'info' : ''}>
                {this.props.showSelection && (
                  <td className={s.selectionColumn}>
                    {selectedRow ? (
                      <FontAwesomeIcon icon={faChevronRight} />
                    ) : (
                      ''
                    )}
                  </td>
                )}
                {/* eslint
                      jsx-a11y/no-noninteractive-element-interactions: "off",
                      jsx-a11y/click-events-have-key-events: "off" */}
                <td
                  onClick={() => {
                    if (this.props.onClientSelect)
                      this.props.onClientSelect(client, index);
                  }}
                >
                  {`${client.name} `}
                  {client.note ? (
                    <OverlayTrigger overlay={tooltip(client.note)}>
                      <Badge variant="secondary">note</Badge>
                    </OverlayTrigger>
                  ) : (
                    ''
                  )}
                  <Badge
                    className="float-right"
                    pill
                    style={{
                      backgroundColor: client.cardColor,
                      color: client.cardColor === 'yellow' ? 'black' : 'white',
                    }}
                  >
                    {client.householdSize}
                  </Badge>
                </td>
                <td className={s.editIcon}>
                  <Link to={`/households/${client.householdId}`}>
                    <FontAwesomeIcon
                      className={s.editIcon}
                      icon={faPencilAlt}
                    />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default withStyles(s)(Clients);
