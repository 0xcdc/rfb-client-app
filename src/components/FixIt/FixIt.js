import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import ApplicationContext from '../ApplicationContext';
import s from './FixIt.css';

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.substring(1);
}

class FixIt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loadingData...',
      snippit: '',
    };
  }

  componentDidMount() {
    const jsonCalls = ['{clients {name}}'].map(url =>
      this.context.graphQL(url),
    );

    Promise.all(jsonCalls).then(jsons => {
      let newState = { dataReady: true };
      jsons.forEach(json => {
        newState = { ...newState, ...json.data };
      });

      this.setState(newState, this.capitalizeNames);
    });
  }

  static contextType = ApplicationContext;

  capitalizeNames() {
    this.setState({ status: 'checking for names to capitalize...' });

    const snippit = [];
    this.state.clients.forEach(c => {
      const { name } = c;
      let nameParts = name.split(/\s+/);
      nameParts = nameParts.map(p => capitalize(p));
      const fixedName = nameParts.join(' ');
      if (c.name !== fixedName) {
        snippit.push(
          <div>
            {name} =&gt; {fixedName}
          </div>,
        );
      }
    });

    this.setState({
      status: 'done',
      snippit,
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.status}</div>
        <div>{this.state.snippit}</div>
      </div>
    );
  }
}

export default withStyles(s)(FixIt);
