/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  FormControl,
  Glyphicon,
  Label,
  Nav,
  NavItem,
  Row,
  Tab,
  Table,
} from 'react-bootstrap';
import s from './Report.css';

const ageBrackets = [2, 18, 54, 110];
const dataLabels = ['Duplicated', 'Unduplicated', 'Total'];
const ageLabels = [
  '0-2 Years',
  '3-18 Years',
  '19-54 Years',
  '55 Plus Years',
  'Unknown Years',
];
const frequencyLabels = ['Monthly', 'Quarterly', 'Annual'];
const frequencyCounts = {
  Monthly: 12,
  Quarterly: 4,
  Annual: 1,
};

class Report extends React.Component {
  static contextTypes = { graphQL: PropTypes.func.isRequired };

  constructor(props) {
    super(props);
    const now = new Date();
    // you typically want the previous month
    let month = now.getMonth();
    let year = now.getFullYear();
    if (month == 0) {
      year--;
      month = 12;
    }
    this.state = {
      data: null,
      year,
      value: month,
      frequency: 'Monthly',
      city: 'All',
      cities: ['All'],
    };

    this.refreshData = this.refreshData.bind(this);
    this.setCity = this.setCity.bind(this);
    this.setFrequency = this.setFrequency.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setYear = this.setYear.bind(this);
  }

  componentDidMount() {
    this.loadCities();
  }

  loadCities() {
    const query = `{households(ids:[]) {city}}`;
    this.context.graphQL(query).then(r => {
      let cities = new Set(r.data.households.map(h => h.city));

      cities.delete('');
      cities = Array.from(cities.values()).sort();

      cities = ['All', 'Bellevue + Unknown', 'Unknown'].concat(cities);

      this.setState({ cities });
    });
  }

  loadData(value, year, freq) {
    const query = [`{firstVisitsForYear(year: ${year}) { householdId, date }}`];
    const freqCount = frequencyCounts[freq];
    const nMonths = 12 / freqCount;
    const firstMonth = (value - 1) * nMonths + 1;
    for (let i = 0; i < nMonths; i++) {
      query.push(
        `{visitsForMonth(month: ${firstMonth +
          i}, year: ${year} ){ householdId, date }}`,
      );
    }

    const dataAvailable = query.map(q => this.context.graphQL(q));
    Promise.all(dataAvailable).then(results => {
      const firstVisit = new Map(
        results
          .shift()
          .data.firstVisitsForYear.map(v => [v.householdId, v.date]),
      );
      let visits = results.reduce(
        (acc, cv) => acc.concat(cv.data.visitsForMonth),
        [],
      );
      const uniqueHouseholds = new Set(visits.map(v => v.householdId));

      const query = `{households(ids:[${[
        ...uniqueHouseholds.values(),
      ]}]) {id, city, clients{ birthYear }}}`;
      const householdsAvailable = this.context.graphQL(query);

      function summarizeHousehold(household) {
        function ageIndex(age) {
          // 1 past the ages array is a sentinal for unknown
          if (!age) {
            return ageBrackets.length;
          }
          for (let i = 0; i < ageBrackets.length; i++) {
            if (age <= ageBrackets[i]) {
              return i;
            }
          }

          return ageBrackets.length;
        }

        const clientBirthYears = household.clients.map(c => c.birthYear);
        const thisYear = new Date().getFullYear();
        const clientAges = clientBirthYears.map(birthYear => {
          birthYear = Number.parseInt(birthYear);
          return Number.isInteger(birthYear) ? thisYear - birthYear : null;
        });

        const ageArray = new Array(ageBrackets.length + 1).fill(0);

        clientAges.forEach(age => {
          const index = ageIndex(age);
          ageArray[index]++;
        });

        household.ageArray = ageArray;
        return household;
      }

      householdsAvailable.then(values => {
        let householdData = values.data.households;
        if (this.state.city != 'All') {
          let city = this.state.city;
          if (city == 'Unknown') {
            city = '';
          }

          householdData = householdData.filter(h => {
            if (city == 'Bellevue + Unknown') {
              return h.city == 'Bellevue' || h.city == '';
            }
            return h.city == city;
          });
        }

        householdData = new Map(
          householdData.map(v => [v.id, summarizeHousehold(v)]),
        );

        if (this.state.city != 'All') {
          // need to filter out the visits for other cities
          visits = visits.filter(v => householdData.has(v.householdId));
        }

        const unduplicatedVisits = visits.filter(
          v => firstVisit.get(v.householdId) == v.date,
        );

        function addArray(lhs, rhs) {
          const res = new Array(Math.max(lhs.length, rhs.length)).fill(0);
          [rhs, lhs].forEach(a => {
            a.forEach((v, i) => {
              res[i] += v;
            });
          });
          return res;
        }

        function joinHouseholdData(visits) {
          return visits
            .map(v => {
              const h = householdData.get(v.householdId);

              return h ? h.ageArray : [];
            })
            .reduce(
              (acc, v) => addArray(acc, v),
              new Array(ageBrackets.length + 1).fill(0),
            );
        }

        const sumArray = a =>
          a.reduce((acc, v) => {
            acc += v;
            return acc;
          }, 0);

        const unduplicatedHouseholdData = joinHouseholdData(unduplicatedVisits);
        const allHouseholdData = joinHouseholdData(visits);

        const unduplicatedIndividuals = sumArray(unduplicatedHouseholdData);
        const totalIndividuals = sumArray(allHouseholdData);

        const ageRanges = {};
        ageLabels.forEach((v, i) => {
          ageRanges[v] = {};
          ageRanges[v].total = allHouseholdData[i];
          ageRanges[v].unduplicated = unduplicatedHouseholdData[i];
        });

        const data = {
          households: {
            unduplicated: unduplicatedVisits.length,
            total: visits.length,
          },
          individuals: {
            unduplicated: unduplicatedIndividuals,
            total: totalIndividuals,
          },
          ageRanges,
        };

        this.setState({ data });
      });
    });
  }

  refreshData() {
    this.loadData(this.state.value, this.state.year, this.state.frequency);
  }

  setCity(e) {
    this.setState({ city: e.target.value });
  }

  setFrequency(e) {
    // set the value to be a reasonable default based on the frequency
    const now = new Date();
    const thisYear = now.getFullYear();
    const frequency = e.target.value;
    let value;
    let year;
    if (frequency == 'Annual') {
      // set to the previous year
      year = thisYear - 1;
      value = 1;
    } else if (frequency == 'Quarterly') {
      // set to the previous quarter
      const quarter = now.getMonth() % 3;
      if (quarter == 0) {
        value = 4;
        year = thisYear - 1;
      } else {
        value = quarter;
        year = thisYear;
      }
    } else if (frequency == 'Monthly') {
      const lastMonth = now.getMonth() - 1;
      if (lastMonth < 0) {
        value = 12;
        year = thisYear - 1;
      } else {
        value = lastMonth;
        year = thisYear;
      }
    } else {
      throw 'unrecongnized frequency';
    }

    this.setState({
      frequency,
      year,
      value,
    });
  }

  setValue(e) {
    this.setState({ value: e.target.value });
  }

  setYear(e) {
    this.setState({ year: e.target.value });
  }

  render() {
    const values = Array(frequencyCounts[this.state.frequency])
      .fill()
      .map((_, i) => {
        const m = i + 1;
        return (
          <option key={m} value={m}>
            {m}
          </option>
        );
      });
    const now = new Date();

    const years = Array(3)
      .fill()
      .map((_, i) => {
        const y = now.getFullYear() - i;
        return (
          <option key={y} value={y}>
            {y}
          </option>
        );
      });

    function arrayToOptions(arr) {
      return arr.map(v => (
        <option key={v} value={v}>
          {v}
        </option>
      ));
    }

    const frequencies = arrayToOptions(frequencyLabels);

    const cities = arrayToOptions(this.state.cities);

    function renderValues(values) {
      function getValue(label, values) {
        switch (label) {
          case 'Total':
            return values.total;
          case 'Duplicated':
            return values.total - values.unduplicated;
          case 'Unduplicated':
            return values.unduplicated;
        }
      }

      return dataLabels.map(k => (
        <tr key={k}>
          <td>{k}:</td>
          <td className={s.data}>{getValue(k, values)}</td>
        </tr>
      ));
    }

    function renderTable(label, values) {
      return (
        <Col xs={6}>
          <Panel>
            <Panel.Heading>{label}</Panel.Heading>
            <Panel.Body>
              <Table condensed>
                <tbody>{renderValues(values)}</tbody>
              </Table>
            </Panel.Body>
          </Panel>
        </Col>
      );
    }

    return (
      <div>
        <Form inline>
          <FormGroup>
            <ControlLabel>Report:</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.state.frequency}
              onChange={this.setFrequency}
            >
              {frequencies}
            </FormControl>
          </FormGroup>
          {this.state.frequency != 'Annual' ? (
            <FormGroup>
              <FormControl
                componentClass="select"
                value={this.state.value}
                onChange={this.setValue}
              >
                {values}
              </FormControl>
            </FormGroup>
          ) : (
            ''
          )}{' '}
          <FormGroup>
            <FormControl
              componentClass="select"
              value={this.state.year}
              onChange={this.setYear}
            >
              {years}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl
              componentClass="select"
              value={this.state.city}
              onChange={this.setCity}
            >
              {cities}
            </FormControl>
          </FormGroup>{' '}
          <Button onClick={this.refreshData}>Refresh</Button>
        </Form>
        <br />
        {this.state.data && (
          <Panel>
            <Row>
              {renderTable('Households Served:', this.state.data.households)}
              {renderTable('Clients Served:', this.state.data.individuals)}
            </Row>
            <Panel>
              <Panel.Heading>
                <Panel.Title toggle>Age Ranges</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                {Object.keys(this.state.data.ageRanges).map(ar => (
                  <Row key={ar}>
                    {renderTable(`${ar}:`, this.state.data.ageRanges[ar])}
                  </Row>
                ))}
              </Panel.Body>
            </Panel>
          </Panel>
        )}
      </div>
    );
  }
}

export default withStyles(s)(Report);
