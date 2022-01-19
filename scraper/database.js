async function create_table() {
  const { Client } = require('pg');

  const client = new Client({
      host: process.env.HOST,
      user: process.env.USER,
      database: process.env.DB,
      password: process.env.PASSWORD,
      port: process.env.PORT,
  });

  const execute = async (query) => {
      try {
          await client.connect();     // gets connection
          await client.query(query);  // sends queries
          return true;
      } catch (error) {
          console.log();
          if (error.name == 'error') {
              console.log('Table already exists.')
          } else {
              console.error(error.stack);
          }
          return false;
      } finally {
          await client.end();         // closes connection
      }
  };

  const text = `
  CREATE TABLE sales (
      sku VARCHAR(15), 
      pageTitle VARCHAR(50), 
      price INT, 
      latitude NUMERIC(15,10), 
      longitude NUMERIC(15, 10), 
      address VARCHAR(300), 
      rooms INT, 
      bedrooms INT, 
      bathrooms INT, 
      gross_area INT, 
      lot_area INT, 
      year INT, 
      type VARCHAR(20), 
      parking INT, 
      unit INT, 
      start_date timestamptz(30), 
      end_date timestamptz(30), 
      PRIMARY KEY (sku))
      ;`;

  execute(text).then(result => {
      if (result) {
          console.log('Table created');
      }
  });

}

async function post_db(sku, pageTitle, price, latitude, longitude, address, rooms, bedrooms, bathrooms, gross_area, lot_area, year, type, parking, unit, start, end) {

  const { Client } = require('pg');
  const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });

  const execute = async (query) => {
      try {
          await client.connect();     // gets connection
          await client.query(query, values);  // sends queries
          return true;
      } catch (error) {
          console.error(error.stack);
          return false;
      } finally {
          await client.end();         // closes connection
      }
  };

  var text = `INSERT INTO sales (
      sku , 
      pageTitle , 
      price , 
      latitude , 
      longitude , 
      address , 
      rooms , 
      bedrooms , 
      bathrooms , 
      gross_area , 
      lot_area , 
      year , 
      type , 
      parking , 
      unit , 
      start_date, 
      end_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      ON CONFLICT (sku) DO UPDATE SET 
      sku = excluded.sku , 
      pageTitle = excluded.pageTitle , 
      price = excluded.price , 
      latitude = excluded.latitude , 
      longitude = excluded.longitude , 
      address = excluded.address , 
      rooms = excluded.rooms , 
      bedrooms = excluded.bedrooms , 
      bathrooms = excluded.bathrooms , 
      gross_area = excluded.gross_area , 
      lot_area = excluded.lot_area , 
      year = excluded.year , 
      type = excluded.type , 
      parking = excluded.parking , 
      unit = excluded.unit , 
      end_date = excluded.end_date;`

  var values = [sku, pageTitle, price, latitude, longitude, address, rooms, bedrooms, bathrooms, gross_area, lot_area, year, type, parking, unit, start, end]

  execute(text).then(result => {
      if (result) {
          console.log('Posted entry.');
      }
  });
  return

}

const { Pool, Client } = require('pg');







module.exports = {
  create_table, post_db
};