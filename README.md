# Historical stock data analyzer

This project is about web site app, that analyzes historical stock data. App asks csv-file and analyzes it. 
After that it shows analyzed data. Optional: user can give date range, that changes analyzed data that date range.
Default date range is max csv-file contained date range.

- A given data range:   
    - Longest bullish trend + chart,
    - Table, with contains the highest trading velume and the most significant stock price change within a day,
    - Table, with contains the best opening price compared to 5 days simple moving average (SMA 5), difference given in percentages(%),

## Live demo

Site live demo link below. First time go to site can take some extra time to load page, so be patent. 
(Heroku sleeps site after 20 min unusage and unsleep takes some time.)

https://historical-stock-data-analyzer.herokuapp.com/

## Features

- React app
- Material UI components and styles
- DevExtreme Reactive tables and chart
- Fully responsive
- Data changes(Given csv or date change) updates information automatically
- Animation to necessary button to get user attention

## Libraries

- React https://reactjs.org/
- Material UI https://material-ui.com/
- React-papaparse https://www.npmjs.com/package/react-papaparse
- Date-fns https://date-fns.org/
- DevExtreme Reactive https://devexpress.github.io/devextreme-reactive/

## Pictures

- favicon and icon https://pixabay.com/fi/vectors/viivakaavion-viivan-viivakaavio-148256/

## Development - Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

