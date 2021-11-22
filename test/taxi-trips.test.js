import assert from 'assert';
import pg from 'pg';
import TaxiTripTracker from '../taxi-trips.js';
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/taxi_tests';

const pool = new Pool({
  connectionString,
});

describe('Taxi Trips', function () {
  // beforeEach(async function () {

  // });

  it('should find how many trips all the taxis made', async function () {
    const taxiTrips = TaxiTripTracker(pool);

    assert.strictEqual(await taxiTrips.totalTripCount(), 57);
  });

  it('should find all the regions', async function () {
    const taxiTrips = TaxiTripTracker(pool);

    assert.deepStrictEqual(
      ['Durban', 'Cape Town', 'Gauteng'],
      await taxiTrips.findAllRegions(),
    );
  });

  it('should find all the taxis for a region', async function () {
    const taxiTrips = TaxiTripTracker(pool);

    assert.deepStrictEqual(
      ['ND 284 983', 'ND 294 824', 'ND 233 034'],
      await taxiTrips.findTaxisForRegion('Durban'),
    );
    assert.deepStrictEqual(
      ['CA 934 672', 'CAA 204 852', 'CA 359 249'],
      await taxiTrips.findTaxisForRegion('Cape Town'),
    );
    assert.deepStrictEqual(
      ['VS34SF GP', 'SL21BE GP', 'XP38DY GP'],
      await taxiTrips.findTaxisForRegion('Gauteng'),
    );
  });

  it('should find all the trips for a reg number', async function () {
    const taxiTrips = TaxiTripTracker(pool);

    const taxiTripsCT = [
      {
        route: 'Cape Town - Bellville',
      },
      {
        route: 'Cape Town - Gugulethu',
      },
      {
        route: 'Cape Town - Bellville',
      },
      {
        route: 'Cape Town - Gugulethu',
      },
      {
        route: 'Cape Town - Bellville',
      },
    ];

    const taxiTripsGP = [
      {
        route: 'Alexandra - Sandton',
      },
      {
        route: 'Sandton - Midrand',
      },
      {
        route: 'Sandton - Randburg',
      },
      {
        route: 'Sandton - Randburg',
      },
    ];

    assert.deepStrictEqual(
      taxiTripsCT,
      await taxiTrips.findTripsByRegNumber('CAA 204 852'),
    );
    assert.deepStrictEqual(
      taxiTripsGP,
      await taxiTrips.findTripsByRegNumber('XP38DY GP'),
    );
  });

  it('should find the total number of trips by region', async function () {
    const taxiTrips = TaxiTripTracker(pool);

    const tripsCT = await taxiTrips.findTripsByRegion('Cape Town');
    const tripsGP = await taxiTrips.findTripsByRegion('Gauteng');
    const tripsDbn = await taxiTrips.findTripsByRegion('Durban');

    assert.deepStrictEqual(17, tripsCT.length);
    assert.deepStrictEqual(15, tripsGP.length);
    assert.deepStrictEqual(25, tripsDbn.length);
  });

  it('find the total income for a given reg number', async function () {
    const taxiTrips = TaxiTripTracker(pool);
    assert.strictEqual(
      67.5,
      await taxiTrips.findIncomeByRegNumber('CAA 204 852'),
    );
    assert.deepStrictEqual(
      36.5,
      await taxiTrips.findIncomeByRegNumber('XP38DY GP'),
    );
  });

  it('find the total income for each taxi', async function () {
    const taxiTrips = TaxiTripTracker(pool);
    assert.deepStrictEqual(
      [
          { reg_number: 'CAA 204 852', total_income: '67.50' },
          { reg_number: 'ND 233 034', total_income: '140.00' },
          { reg_number: 'SL21BE GP', total_income: '64.50' },
          { reg_number: 'XP38DY GP', total_income: '36.50' },
          { reg_number: 'CA 934 672', total_income: '77.00' },
          { reg_number: 'ND 294 824', total_income: '107.00' },
          { reg_number: 'ND 284 983', total_income: '93.00' },
          { reg_number: 'VS34SF GP', total_income: '36.50' },
          { reg_number: 'CA 359 249', total_income: '61.00' }
  ],
      await taxiTrips.findTotalIncomePerTaxi(),
    );
  });

  it('find the total income for all the taxis', async function () {
    const taxiTrips = TaxiTripTracker(pool);
    assert.deepStrictEqual(683, await taxiTrips.findTotalIncome());
  });
    
    it('find the total income for each region', async function () {
    const taxiTrips = TaxiTripTracker(pool);
    assert.deepStrictEqual([
  { region: 'Durban', total_income: '340.00' },
  { region: 'Cape Town', total_income: '205.50' },
  { region: 'Gauteng', total_income: '137.50' }
], await taxiTrips.findTotalIncomeByRegion());
  });

  after(function () {
    pool.end();
  });
});
