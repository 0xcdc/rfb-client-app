import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import ApplicationContext from '../ApplicationContext';
import s from './Report.css';

const ageBrackets = [2, 18, 54, 110];
function ageIndex(age) {
  // 1 past the ages array is a sentinal for unknown
  if (!Number.isInteger(age)) return ageBrackets.length;
  for (let i = 0; i < ageBrackets.length; i += 1) {
    if (age <= ageBrackets[i]) return i;
  }

  return ageBrackets.length;
}

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

function addArray(lhs, rhs) {
  const res = new Array(Math.max(lhs.length, rhs.length)).fill(0);
  [rhs, lhs].forEach(a => {
    a.forEach((v, i) => {
      res[i] += v;
    });
  });
  return res;
}

function arrayToOptions(arr) {
  return arr.map(v => {
    return (
      <option key={v} value={v}>
        {v}
      </option>
    );
  });
}

function getValue(label, values) {
  switch (label) {
    case 'Total':
      return values.total;
    case 'Duplicated':
      return values.total - values.unduplicated;
    case 'Unduplicated':
      return values.unduplicated;
    default:
      throw new Error('unrecognized label');
  }
}

function joinHouseholdData(householdData, visits) {
  return visits
    .map(v => {
      const h = householdData.get(`${v.householdId}-${v.householdVersion}`);

      return h ? h.ageArray : [];
    })
    .reduce((acc, v) => {
      return addArray(acc, v);
    }, new Array(ageBrackets.length + 1).fill(0));
}

function renderValues(values) {
  return dataLabels.map(k => {
    return (
      <tr key={k}>
        <td>{k}:</td>
        <td className={s.data}>{getValue(k, values)}</td>
      </tr>
    );
  });
}

function renderTable(label, values) {
  return (
    <Col xs={6}>
      <Card>
        <Card.Body>
          <Card.Title>{label}</Card.Title>
          <Table size="sm">
            <tbody>{renderValues(values)}</tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
}

function sumArray(a) {
  return a.reduce((acc, v) => {
    return acc + v;
  }, 0);
}

function summarizeHousehold(household) {
  const clientBirthYears = household.clients.map(c => {
    return c.birthYear;
  });
  const thisYear = new Date().getFullYear();
  const clientAges = clientBirthYears.map(birthYear => {
    const nBirthYear = Number.parseInt(birthYear, 10);
    return Number.isInteger(nBirthYear) ? thisYear - nBirthYear : null;
  });

  const ageArray = new Array(ageBrackets.length + 1).fill(0);

  clientAges.forEach(age => {
    const index = ageIndex(age);
    ageArray[index] += 1;
  });

  const retval = household;
  retval.ageArray = ageArray;
  return retval;
}

class Report extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();
    // you typically want the previous month
    let month = now.getMonth();
    let year = now.getFullYear();
    if (month === 0) {
      year -= 1;
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
    if (frequency === 'Annual') {
      // set to the previous year
      year = thisYear - 1;
      value = 1;
    } else if (frequency === 'Quarterly') {
      // set to the previous quarter
      const quarter = now.getMonth() % 3;
      if (quarter === 0) {
        value = 4;
        year = thisYear - 1;
      } else {
        value = quarter;
        year = thisYear;
      }
    } else if (frequency === 'Monthly') {
      const lastMonth = now.getMonth() - 1;
      if (lastMonth < 0) {
        value = 12;
        year = thisYear - 1;
      } else {
        value = lastMonth;
        year = thisYear;
      }
    } else {
      throw new Error('unrecongnized frequency');
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

  static contextType = ApplicationContext;

  loadCities() {
    const query = `{cities {name}}`;
    this.context.graphQL(query).then(json => {
      let cities = json.data.cities.map(c => c.name);

      cities = ['All', 'Bellevue + Unknown'].concat(cities);

      this.setState({ cities });
    });
  }

  loadData(value, year, freq) {
    const query = [`{firstVisitsForYear(year: ${year}) { householdId, date }}`];
    const freqCount = frequencyCounts[freq];
    const nMonths = 12 / freqCount;
    const firstMonth = (value - 1) * nMonths + 1;
    for (let i = 0; i < nMonths; i += 1) {
      query.push(`
{visitsForMonth(month: ${firstMonth + i}, year: ${year} )
  { householdId, householdVersion, date }
}
`);
    }

    const dataAvailable = query.map(q => {
      return this.context.graphQL(q);
    });
    Promise.all(dataAvailable).then(results => {
      const firstVisit = new Map(
        results.shift().data.firstVisitsForYear.map(v => {
          return [v.householdId, v.date];
        }),
      );
      let visits = results.reduce((acc, cv) => {
        return acc.concat(cv.data.visitsForMonth);
      }, []);
      const uniqueHouseholds = Object.fromEntries(
        visits.map(v => [`${v.householdId}-${v.householdVersion}`, 1]),
      );

      const householdQueries = Object.keys(uniqueHouseholds).map(key => {
        const [id, version] = key.split('-');
        return `{
          household(id: ${id}, version: ${version}) {
            id version city {name} clients { birthYear}
          }
        }`;
      });

      const householdsAvailable = householdQueries.map(q => {
        return this.context.graphQL(q);
      });

      Promise.all(householdsAvailable).then(values => {
        let householdData = values.map(result => {
          const { household } = result.data;
          return {
            id: household.id,
            version: household.version,
            city: household.city.name,
            clients: household.clients,
          };
        });

        // cut the households down to the specified cities
        if (this.state.city !== 'All') {
          const { city } = this.state;

          householdData = householdData.filter(h => {
            if (city === 'Bellevue + Unknown')
              return h.city === 'Bellevue' || h.city === 'Unknown';

            return h.city === city;
          });
        }

        householdData = new Map(
          householdData.map(v => {
            return [`${v.id}-${v.version}`, summarizeHousehold(v)];
          }),
        );

        if (this.state.city !== 'All') {
          // need to filter out the visits to the remaining households
          visits = visits.filter(v => {
            return householdData.has(`${v.householdId}-${v.householdVersion}`);
          });
        }

        const unduplicatedVisits = visits.filter(v => {
          return firstVisit.get(v.householdId) === v.date;
        });

        const unduplicatedHouseholdData = joinHouseholdData(
          householdData,
          unduplicatedVisits,
        );
        const allHouseholdData = joinHouseholdData(householdData, visits);

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

    const frequencies = arrayToOptions(frequencyLabels);

    const cities = arrayToOptions(this.state.cities);

    return (
      <div>
        <Form inline>
          <Form.Group>
            <Form.Label>Report:</Form.Label>
            <Form.Control
              as="select"
              value={this.state.frequency}
              onChange={this.setFrequency}
            >
              {frequencies}
            </Form.Control>
          </Form.Group>
          {this.state.frequency !== 'Annual' ? (
            <Form.Group>
              <Form.Control
                as="select"
                value={this.state.value}
                onChange={this.setValue}
              >
                {values}
              </Form.Control>
            </Form.Group>
          ) : (
            ' '
          )}
          <Form.Group>
            <Form.Control
              as="select"
              value={this.state.year}
              onChange={this.setYear}
            >
              {years}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="select"
              value={this.state.city}
              onChange={this.setCity}
            >
              {cities}
            </Form.Control>
          </Form.Group>{' '}
          <Button onClick={this.refreshData}>Refresh</Button>
        </Form>
        <br />
        {this.state.data && (
          <Card>
            <Row>
              {renderTable('Households Served:', this.state.data.households)}
              {renderTable('Clients Served:', this.state.data.individuals)}
            </Row>
            <Card>
              <Card.Body>
                <Card.Title>Age Ranges</Card.Title>
                {Object.keys(this.state.data.ageRanges).map(ar => {
                  return (
                    <Row key={ar}>
                      {renderTable(`${ar}:`, this.state.data.ageRanges[ar])}
                    </Row>
                  );
                })}
              </Card.Body>
            </Card>
          </Card>
        )}
      </div>
    );
  }
}

export default withStyles(s)(Report);
