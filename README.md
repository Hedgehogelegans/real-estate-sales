# Real estate sales scraper.

 ## Overview

This is a scraper that extract data from real estate website such as type of property, price, number of rooms, location and stores the data in a PostgreSQL database.

### Docker Compose

```console
$ docker build --tag real-estate-sales https://github.com/Hedgehogelegans/real-estate-sales.git#main
$ docker run --name real-estate-sales --network="bridge"  -p 5900:5900 -d real-estate-sales
$ docker logs real-estate-sales

```