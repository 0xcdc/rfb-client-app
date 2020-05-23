export default function(sqlMigration) {
  const fixIt = {
    Bellevue: [
      'b',
      'B',
      '98007',
      'BELL',
      'Belelvue',
      'Bell',
      'Belleuve',
      'bell',
      'Bellvue',
      'Bellevue ',
      'BellevuE',
    ],
    'Des Moines': ['Desmoines', 'Des'],
    Kirkland: ['Kirkand', 'Kirland'],
    Lynnwood: ['lynwood'],
    Newcastle: ['New Castle'],
    Redmond: ['redm'],
    Tukwila: ['Tukwilla'],
    Sammamish: ['Samammish', 'Sammammish'],
    SeaTac: ['Sea-tac', 'Seatac'],
  };

  const sqlList = [];

  Object.keys(fixIt).forEach(good => {
    fixIt[good].forEach(bad => {
      const sql = `update household set city = '${good}' where city = '${bad}'`;
      sqlList.push(sql);
    });
  });

  const zipcodes = {
    Bellevue: [98005, 98007],
    Kirkland: [98033],
    Redmond: [98053],
    Renton: [98059],
  };

  Object.keys(zipcodes).forEach(city => {
    zipcodes[city].forEach(zip => {
      const sql = `update household set city='${city}' where city='' and zip='${zip}'`;
      sqlList.push(sql);
    });
  });

  return sqlMigration(sqlList);
}
