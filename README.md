# Real estate sales scraper

## Overview

Real estate sales scraper that extract data such as type of property, price, number of rooms, location. Data is then stored in a PostgreSQL database for further analysis.

### Docker Compose

```console
$ docker build --tag real-estate-sales https://github.com/Hedgehogelegans/real-estate-sales.git#main
$ docker run --name real-estate-sales -e DB_HOST=HOST -e DB_USER=USER -e DB_NAME=NAME -e DB_PASSWORD=PASSWORD -e DB_PORT=PORT --network="bridge"  -p 5900:5900 -d real-estate-sales
$ docker logs real-estate-sales
```
