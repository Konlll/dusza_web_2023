#! /bin/bash

# /var/www/install.sh

cd /var/www
systemctl stop backend.service
rm -r dusza_web_2023-master
rm -r html
rm -r backend

unzip dusza_web_2023-master.zip
cd dusza_web_2023-master
cp -r ./backend ../backend

cd client/online-competition
npm install
npm run build
mv ./dist /var/www/html

cd /var/www/backend
npm install
cat > .env << EOL
PORT=3000
SECRET=ixp8tpqa67jye9
EOL
npx prisma migrate deploy
systemctl start backend.service
