const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite');

const fixIt = {
  Bellevue: ['98007', 'BELL', 'Belelvue', 'Bell', 'Belleuve', 'bell'],
  Kirkland: ['Kirkand', 'Kirland'],
  Redmond: ['redm'],
  Tukwila: ['Tukwilla'],
  Lynnwood: ['lynwood'],
  Newcastle: ['New Castle'],
  Seatac: ['Sea-tac'],
  'Des Moines': ['Desmoines'],
};

db.all('select city from household', (err, row) => {
  let cities = row.map(r => {
    return r.city;
  });

  cities = new Set(cities);
  cities = Array.from(cities.values());

  cities.forEach(city => {
    const fixedCity = city
      .trim()
      .split(' ')
      .map(p => {
        return p.slice(0, 1).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join(' ');

    if (city !== fixedCity) {
      if (!fixIt[fixedCity]) fixIt[fixedCity] = [];
      fixIt[fixedCity].push(city);
    }
  });

  Object.keys(fixIt).forEach($good => {
    fixIt[$good].forEach($bad => {
      db.run('update household set city = $good where city = $bad', {
        $good,
        $bad,
      });
      console.info({ $good, $bad });
    });
  });
});

const missingCities = {
  19: 'Redmond',
  681: 'Bellevue',
  880: 'Bellevue',
  1663: 'Bellevue',
};

Object.keys(missingCities).forEach($id => {
  const $city = missingCities[$id];
  db.run('update household set city = $city where id = $id', {
    $city,
    $id,
  });
  console.info({ $id, $city });
});
