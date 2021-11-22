export default function TaxiTripTracker(pool) {
  const totalTripCount = async () => {
    const result = await pool.query('SELECT COUNT(id) AS trip_count FROM trip');
    return parseFloat(result.rows[0]['trip_count'])
  };
  const findAllRegions = async () => {
    const result = await pool.query('SELECT name FROM region');
    return result.rows.map(region => region.name);
  };
  const findTaxisForRegion = async (region) => {
    const result = await pool.query('SELECT reg_number FROM taxi JOIN region ON taxi.region_id = region.id WHERE region.name = $1', [region]);
    return result.rows.map(taxi => taxi.reg_number);
  };
  const findTripsByRegNumber = async (regNum) => {
    const result = await pool.query('SELECT route.name AS route FROM trip JOIN route ON route_id = route.id JOIN taxi ON taxi_id = taxi.id WHERE taxi.reg_number = $1', [regNum]);
    return result.rows;
  };
  const findTripsByRegion = async (region) => {
    const result = await pool.query('SELECT route.name AS route, taxi.reg_number AS taxi FROM trip JOIN route ON route_id = route.id JOIN taxi ON taxi_id = taxi.id  JOIN region ON taxi.region_id = region.id WHERE region.name = $1', [region]);
    
    return result.rows;
  };
  const findIncomeByRegNumber = async (regNum) => {
     const result = await pool.query('SELECT SUM(route.cost) AS total_income FROM trip JOIN route ON route_id = route.id JOIN taxi ON taxi_id = taxi.id WHERE taxi.reg_number = $1', [regNum]);
    return parseFloat(result.rows[0]['total_income']);
  };
  const findTotalIncomePerTaxi = async () => {
    const result = await pool.query('SELECT taxi.reg_number, SUM(route.cost) AS total_income FROM trip JOIN route ON route_id = route.id JOIN taxi ON taxi_id = taxi.id GROUP BY taxi.reg_number');
    return result.rows;
  };
  const findTotalIncome = async () => {
    const result = await pool.query('SELECT SUM(route.cost) AS total_income FROM trip JOIN route ON route_id = route.id');
    return parseFloat(result.rows[0]['total_income']);
  };
  const findTotalIncomeByRegion = async () => {
    const result = await pool.query('SELECT region.name AS region, SUM(route.cost) AS total_income FROM trip JOIN route ON route_id = route.id JOIN region ON route.region_id = region.id GROUP BY region.name');
    return result.rows;
    
  };

  return {
    totalTripCount,
    findAllRegions,
    findTaxisForRegion,
    findTripsByRegNumber,
    findTripsByRegion,
    findIncomeByRegNumber,
    findTotalIncomePerTaxi,
    findTotalIncome,
    findTotalIncomeByRegion,
  };
}
