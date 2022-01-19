FROM node:latest

# Create app directory
WORKDIR /usr/src/app/

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update
RUN apt-get -y install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libgtk-3-0 libdrm2 libgbm1

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install pg
RUN npm install puppeteer
RUN npm install puppeteer-extra-plugin-stealth
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
EXPOSE 8080
# RUN mkdir ~/.vnc
# RUN x11vnc -storepasswd 1234 ~/.vnc/passwd
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x entrypoint.sh
# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

CMD ["index.js"]