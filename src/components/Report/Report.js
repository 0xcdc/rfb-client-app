/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Col, ControlLabel, Form, FormGroup, FormControl, Glyphicon, Label, Nav, NavItem, Panel, Row, Tab, Table } from 'react-bootstrap';
import s from './Report.css';
import { fetch } from '../common';

const ageBrackets = [2, 18, 54, 110]
const dataLabels = ["Duplicated", "Unduplicated", "Total"];
const ageLabels = ["0-2 Years", "3-18 Years", "19-54 Years", "55 Plus Years", "Unknown Years"];

class Report extends React.Component {
  constructor(props) {
    super(props);
    let now = new Date();
    //you typically want the previous month
    let month = now.getMonth();
    let year = now.getFullYear();
    if(month == 0) {
      year--;
      month = 12;
    }
    this.state = {
      data: null,
      year,
      month,
    };

    this.refreshData = this.refreshData.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.setYear = this.setYear.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  loadData(month, year) {
    let query = [
      `{visitsForMonth(month: ${month}, year: ${year} ){ householdId, date }}`,
      `{firstVisitsForYear(year: ${year}) { householdId, date }}`,
    ];
    let dataAvailable = query.map( (q) => {
      return fetch(q);
    });
    Promise.all(dataAvailable).then( (results) => {
      let visitsThisMonth = results[0].data.visitsForMonth;
      let firstVisit = new Map(results[1].data.firstVisitsForYear.map( (v) => {
        return [v.householdId, v.date];
      }));
      let uniqueHouseholds = new Set(visitsThisMonth.map( (v) => {
        return v.householdId;
      }));

      let query = `{households(ids:[${[...uniqueHouseholds.values()]}]) {id, clients{ birthYear }}}`;
      let householdsAvailable = fetch(query);

      let unduplicatedVisits = visitsThisMonth.filter( (v) => {
        return firstVisit.get(v.householdId) == v.date;
      });

      let summarizeHousehold = (household) => {
        let ageIndex = ( age ) => {
          //1 past the ages array is a sentinal for unknown
          if(!age) { return ageBrackets.length; }
          for(let i=0; i < ageBrackets.length; i++) {
            if(age <= ageBrackets[i]) { return i; }
          };

          return ageBrackets.length;
        };

        let clientBirthYears = household.clients.map( (c) => {
          return c.birthYear;
        });
        let thisYear = new Date().getFullYear();
        let clientAges = clientBirthYears.map( (birthYear) => {
          birthYear = Number.parseInt(birthYear);
          return Number.isInteger(birthYear) ? thisYear - birthYear : null;
        });

        let ageArray = new Array(ageBrackets.length + 1).fill(0);

        clientAges.forEach( (age) => {
          let index = ageIndex(age);
          ageArray[index]++;
        });

        return [ household.id, ageArray ];
      };

      householdsAvailable.then( (values) => {
        let householdData = new Map(values.data.households.map( (v) => {
          return summarizeHousehold(v);
        }));

        let addArray = (lhs, rhs) => {
          for(let i =0; i< rhs.length; i++) {
            lhs[i] += rhs[i];
          };
          return lhs;
        }

        let joinHouseholdData = (visits) => {
          return visits.map( (v) => {
            return householdData.get(v.householdId);
          }).reduce( (acc, v) => {
              return addArray(acc, v);
            },
            new Array(ageBrackets.length + 1).fill(0)
          );
        };

        let sumArray = (a) => {
          return a.reduce( (acc, v) => {
            acc += v;
            return acc;
          }, 0);
        }

        let unduplicatedHouseholdData = joinHouseholdData(unduplicatedVisits);
        let allHouseholdData = joinHouseholdData(visitsThisMonth);

        let unduplicatedIndividuals = sumArray(unduplicatedHouseholdData);
        let totalIndividuals = sumArray(allHouseholdData);

        let ageRanges = {};
        ageLabels.forEach( (v, i) => {
          ageRanges[v] = {};
          ageRanges[v].total = allHouseholdData[i];
          ageRanges[v].unduplicated = unduplicatedHouseholdData[i];
        });

        let data = {
          households: {
            unduplicated: unduplicatedVisits.length,
            total: visitsThisMonth.length,
          },
          individuals: {
            unduplicated: unduplicatedIndividuals,
            total: totalIndividuals,
          },
          ageRanges,
        };


        this.setState({ data });
      });
    })
  }

  refreshData() {
    this.loadData(this.state.month, this.state.year);
  }

  setMonth(e) {
    this.setState({month: e.target.value});
  }

  setYear(e) {
    this.setState({year: e.target.value});
  }

  render() {
    let months = Array(11).fill().map( (_, i) => {
      let m = i+1;
      return <option key={m} value={m}>{m}</option>
    });
    let now= new Date();
    let years = Array(3).fill().map( (_, i) => {
      let y = now.getFullYear() - i;
      return <option key={y} value={y}>{y}</option>
    });

    function renderValues(values) {
      function getValue(label, values) {
        switch(label) {
          case "Total": return values.total;
          case "Duplicated": return values.total - values.unduplicated;
          case "Unduplicated": return values.unduplicated;
        }
      }

      return dataLabels.map( (k) => {
        return (
          <tr key={k}>
            <td>{k}:</td>
            <td className={s.data}>{getValue(k, values)}</td>
          </tr>
        );})
    }

    function renderTable(label, values) {
      return (
          <Col xs={6}>
            <Panel header={label}>
              <Table condensed>
                <tbody>
                  {renderValues(values)}
                </tbody>
              </Table>
            </Panel>
          </Col>);
    }

    return (
      <div>
        <Form inline>
          <FormGroup>
            <ControlLabel>Month:</ControlLabel>
            <FormControl componentClass="select" value={this.state.month} onChange={this.setMonth}>
              {months}
            </FormControl>
          </FormGroup>
          {" "}
          <FormGroup>
            <ControlLabel>Year:</ControlLabel>
            <FormControl componentClass="select" value={this.state.year} onChange={this.setYear}>
            {years}
            </FormControl>
          </FormGroup>
          {" "}
          <Button type="submit" onClick={this.refreshData}>Refresh</Button>
        </Form>
        <br/>
        {this.state.data &&
        <Panel>
          <Row>
          {renderTable("Households Served:",this.state.data.households)}
          {renderTable("Clients Served:", this.state.data.individuals)}
          </Row>
          {Object.keys(this.state.data.ageRanges).map( (ar) => {
            return (
                <Row key={ar}>
                  {renderTable(ar+":", this.state.data.ageRanges[ar])}
                </Row>
                )})
          }

        </Panel>
        }
      </div>
    );
  }
}

export default withStyles(s)(Report);
