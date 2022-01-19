const formater = require("./formater");
const database = require("./database");

async function scrap(page) {
  try {
    await database.create_table();
    // Get total number of item to assess the number of page to scrap
    let rawNumber = await page.evaluate(
      () =>
        document.querySelector("#divWrapperPager > ul > li.pager-current")
          .textContent
    );
    let totalPage = rawNumber.replace(/ /g, "").replace("1/", "");
    console.log("Total page is : " + totalPage);

    for (let i = 0; i < totalPage; i++) {
      sku =
        pageTitle =
        price =
        latitude =
        longitude =
        address =
        rooms =
        bedrooms =
        bathrooms =
        gross_area =
        lot_area =
        year =
        type =
        parking =
        unit =
          0;
      var sku = await formater.get_sku(page);
      if (sku == 0) {
        try {
          await page.reload();
          await page.waitForTimeout(6000);
          sku = await formater.get_sku(page);
        } catch (err) {
          console.log("Retry sku 1", err);
        }
      } else if (sku == 0) {
        try {
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(6000);
          sku = await formater.get_sku(page);
        } catch (err) {
          console.log("Retry sku 2", err);
        }
      }
      console.log(i + " - " + sku);
      var pageTitle = await formater.get_title(page);
      var price = await formater.get_price(page);
      // Get geographical data
      var latitude = await formater.get_latitude(page);
      var longitude = await formater.get_longitude(page);
      var address = await formater.get_address(page);
      // Get teaser infos
      var rooms = await formater.get_rooms(page);
      var bedrooms = await formater.get_bedrooms(page);
      var bathrooms = await formater.get_bathrooms(page);
      // Get characteristis
      var { gross_area, lot_area, year, type, parking, unit } =
        await formater.get_carac(page);

      // Generates start date and end date. Unlike start date, end date will be updated during subsequent run to assess how long the listing was online
      var start = new Date().toISOString().split("T")[0];
      var end = new Date().toISOString().split("T")[0];

      // Post data to teh DB
      await database.post_db(
        sku,
        pageTitle,
        price,
        latitude,
        longitude,
        address,
        rooms,
        bedrooms,
        bathrooms,
        gross_area,
        lot_area,
        year,
        type,
        parking,
        unit,
        start,
        end
      );

      // Navigate to next item
      await page.keyboard.press("ArrowRight");
      function randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      const rndInt = randomIntFromInterval(4000, 6000);
      await page.waitForTimeout(rndInt);
    }
  } catch (err) {
    console.log("Cannot scrap data.", err);
  }
  return;
}

module.exports = { scrap };
