# arkcoin

Dashboard for arkcoin.net

## Developer Installation

```
git clone https://github.com/Jarunik/arkcoin
cd arkcoin
npm install
npm install --save react-router-dom
npm install react-linkify --save
npm install --save moment
npm install webfontloader --save
npm install --save react-bootstrap bootstrap@3
npm run
```

## Run for developement

```
npm start
```

## Build for production

```
git clone https://github.com/Jarunik/arkcoin
cd arkcoin
bash build.sh
mv build ~/www
```

You will have to use nginx or another webserver to publish the www folder.
