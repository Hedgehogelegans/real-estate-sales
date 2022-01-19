let log = false;

async function get_title(page) {
  var value = 0;
  try {
    await page.waitForSelector(
      "#overview > div:nth-child(3) > div.col-12.d-block.d-sm-none.house-info > div.address > h1 > span",
      { timeout: 5000 }
    );
    var element = await page.$(
      "#overview > div:nth-child(3) > div.col-12.d-block.d-sm-none.house-info > div.address > h1 > span"
    );
    value = await page.evaluate((el) => el.textContent, element);
  } catch (err) {
    if (log == true) {
      console.log("Cannot read title");
    }
  }
  return value;
}

async function get_price(page) {
  var value = 0;
  try {
    await page.waitForSelector("#BuyPrice", { timeout: 5000 });
    var element = await page.$("#BuyPrice");
    var text = await page.evaluate((el) => el.textContent, element);
    var value = await parseInt(
      text.replace("$", "").replace(/ /g, "").replace(/\s/g, "").trim()
    );
  } catch (err) {
    if (log == true) {
      console.log("Cannot read price");
    }
  }
  return value;
}

async function get_sku(page) {
  var value = 0;
  try {
    await page.waitForSelector("#ListingDisplayId", { timeout: 15000 });
    var element = await page.$("#ListingDisplayId");
    var text = await page.evaluate((el) => el.textContent, element);
    var value = await parseInt(
      text.replace(/ /g, "").replace(/\s/g, "").trim()
    );
  } catch (err) {
    if (log == true) {
      console.log("Cannot read sku");
    }
  }
  return value;
}

async function get_latitude(page) {
  var value = 0;
  try {
    const inner_html = await page.$eval(
      "#property-result",
      (element) => element.innerHTML
    );
    var raw = await inner_html.split("data-lat=")[1].split('"')[1];
    var value = await parseFloat(raw);
  } catch (err) {
    if (log == true) {
      console.log("Cannot read latitude");
    }
  }
  return value;
}

async function get_longitude(page) {
  var value = 0;
  try {
    const inner_html = await page.$eval(
      "#property-result",
      (element) => element.innerHTML
    );
    var raw = await inner_html.split("data-lng=")[1].split('"')[1];
    var value = await parseFloat(raw);
  } catch (err) {
    if (log == true) {
      console.log("Cannot read longitude");
    }
  }
  return value;
}

async function get_address(page) {
  var value = 0;
  try {
    await page.waitForSelector(
      "#overview > div:nth-child(3) > div.col-12.d-block.d-sm-none.house-info > div.address > h2"
    );
    var element = await page.$(
      "#overview > div:nth-child(3) > div.col-12.d-block.d-sm-none.house-info > div.address > h2"
    );
    var value = await page.evaluate((el) => el.textContent, element);
  } catch (err) {
    if (log == true) {
      console.log("Cannot read address");
    }
  }
  return value;
}
//////////////////////////////
// Teaser functions
/////////////////////////////

async function get_rooms(page) {
  var value = 0;
  try {
    var elements = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("col-lg-3 col-sm-6 piece"),
        (e) => e.innerText
      )
    );
    var value = parseInt(
      elements[0]
        .replace(" pièces", "")
        .replace(" pièce", "")
        .replace(/ /g, "")
        .replace(/\s/g, "")
        .trim()
    );
  } catch (err) {
    if (log == true) {
      console.log("Cannot read rooms");
    }
  }
  return value;
}

async function get_bedrooms(page) {
  var value = 0;
  try {
    var elements = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("col-lg-3 col-sm-6 cac"),
        (e) => e.innerText
      )
    );
    var value = parseInt(elements[0].replace(" chambre", "").replace("s", ""));
  } catch (err) {
    if (log == true) {
      console.log("Cannot read bedrooms");
    }
  }
  return value;
}

async function get_bathrooms(page) {
  var value = 0;
  try {
    var elements = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("col-lg-3 col-sm-6 sdb"),
        (e) => e.innerText
      )
    );
    if (elements[0].includes("et")) {
      var raw = elements[0]
        .replace(" salle de bain", "")
        .replace(" salles de bain", "")
        .replace(" salle d'eau", "")
        .replace(" salles d'eau", "");
      var int = raw.replace(" ", "").split(" et ");
      let value = 0;
      int.forEach(sum);
      function sum(item) {
        value += parseInt(item);
      }
    } else {
      var value = parseInt(
        elements[0]
          .replace(" salle de bain", "")
          .replace(" salles de bain", "")
          .replace(" salle d'eau", "")
          .replace(" salles d'eau", "")
      );
    }
  } catch (err) {
    if (log == true) {
      console.log("Cannot read bathrooms");
    }
  }
  return value;
}
//////////////////////////////
// Caract functions
/////////////////////////////

async function get_carac(page) {
  var gross_area = (lot_area = year = type = parking = unit = 0);
  try {
    var elements = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("col-lg-3 col-sm-6 carac-container"),
        (e) => e.innerText
      )
    );
    elements.forEach((element) => {
      if (element.includes("Superficie nette")) {
        try {
          gross_area = parseInt(
            element
              .replace("Superficie nette", "")
              .replace("pc", "")
              .replace(" ", "")
          );
        } catch (error) {
          if (log == true) {
            console.log("Cannot read gross area");
          }
          gross_area = 0;
        }
      } else if (element.includes("Superficie du terrain")) {
        try {
          lot_area = parseInt(
            element
              .replace("Superficie du terrain", "")
              .replace("pc", "")
              .replace(" ", "")
          );
        } catch (error) {
          if (log == true) {
            console.log("Cannot read lot area");
          }
          lot_area = 0;
        }
      } else if (element.includes("Année de construction")) {
        try {
          year = parseInt(
            element
              .replace("Année de construction", "")
              .replace(", En conversion", "")
          );
        } catch (error) {
          if (log == true) {
            console.log("Cannot read year");
          }
          year = 0;
        }
        if (isNaN(year)) {
          year = 0;
        }
      } else if (element.includes("Type de copropriété")) {
        try {
          type = element
            .replace("Type de copropriété", "")
            .replace(/[\n\r]+|[\s]{2,}/g, " ")
            .trim();
        } catch (error) {
          if (log == true) {
            console.log("Cannot read copro type");
          }
          type = 0;
        }
      } else if (element.includes("Stationnement total")) {
        parking = 1;
      } else if (element.includes("Nombre d’unités")) {
        if (element.includes(",")) {
          try {
            var raw = element
              .replace("Nombre d’unités", "")
              .replace("Commercial ", "")
              .replace("Résidentiel ", "")
              .replace("(", "")
              .replace(")", "")
              .replace(" ", "")
              .split(",");
            var int = raw.replace(" ", "").split(" et ");
            unit = 0;
            int.forEach(sum);
            function sum(item) {
              unit += parseInt(item);
            }
          } catch (error) {
            if (log == true) {
              console.log("Cannot read number of units");
            }
            type = 0;
          }
        } else {
          try {
            unit = parseInt(
              element
                .replace("Nombre d’unités", "")
                .replace("Commercial ", "")
                .replace("Résidentiel ", "")
                .replace("(", "")
                .replace(")", "")
            );
          } catch (error) {
            if (log == true) {
              console.log("Cannot read number of units");
            }
            type = 0;
          }
        }
      }
    });
  } catch (err) {
    console.log("Error with caracteristics");
  }

  return { gross_area, lot_area, year, type, parking, unit };
}

module.exports = {
  get_title,
  get_price,
  get_sku,
  get_latitude,
  get_longitude,
  get_address,
  get_rooms,
  get_bedrooms,
  get_bathrooms,
  get_carac,
};
