import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import compareDesc from 'date-fns/compareDesc'

import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  ZoomAndPan,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { scaleTime } from 'd3-scale';
import { ArgumentScale, EventTracker } from '@devexpress/dx-react-chart';

/***************************** CSS & STYLES & FORMATING ***************************/
// Component CSS styles
const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    backgroundColor: '#F6F6F6',
    width: 'auto',
    textAlign: 'left',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
    marginTop: '10px',
  },
  cardContent: {
    padding: 20,
    transition: 'opacity ease 0.5s',
  },
  cardTitle: {
    color: 'white',
    backgroundColor: '#1976D2',
    textAlign: 'left',
    padding: 20,
  },
  typography: {
    noWrap: false,
    wordWrap: "break-word",
    marginBottom: '10px',
  }
})

// Adding y axis values $ symbol
const Label = symbol => (props) => {
  const { text } = props;
  return (
    <ValueAxis.Label
      {...props}
      text={text + symbol}
    />
  );
};

const PriceLabel = Label(' $');

/*************************************** CLASS ******************************************/
class LongestBullish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: "",
            end_date: "",
            longest_bullish: "",
            chart_data: [],
            viewport: undefined,
            opacity: 0,
        };
        this.viewportChange = viewport => this.setState({ viewport });
    }

    static getDerivedStateFromProps(props, state) {
      if (props.data !== state.csv_data || props.start !== state.start_date || props.end !== state.end_date) {
        let bullish_temp = 0;
        let max_bullish = 1;
        let last_day_data = 0.0;
        let chart_data_temp = [];

        // Reverse data array content
        const reverse_data_array = props.data.map(temp => temp).reverse();

        // Get longest bullish
        reverse_data_array.forEach((day) => {
          if(day.data[0] !== "Date" && day.data[0] !== "") {  // Remove table header and empty arrays     
            // User input days range - pick days only in range      
            if(compareDesc(new Date(props.start), new Date(day.data[0])) !== -1 && compareDesc(new Date(day.data[0]), new Date(props.end)) !== -1) {
              // Get longest bullish
              let close_last = day.data[1].substring(2) // Remove string unnesesary marks, like '$'
              // Is it first value? is it, then safe compare value to variable
              if(last_day_data){
                if(parseFloat(close_last) > last_day_data){
                  bullish_temp += 1
                  // Save max bullish
                  if(max_bullish < bullish_temp){
                    max_bullish = bullish_temp;
                  }
  
                  last_day_data = parseFloat(close_last)
                } else {
                  bullish_temp = 1
                  last_day_data = parseFloat(close_last)
                }
              } else {
                bullish_temp = 1
                last_day_data = parseFloat(close_last)
              }

              chart_data_temp.push({x: new Date(day.data[0]), y: parseFloat(close_last)})
            }
          }           
        })

        // Save parsed data to state - if start or end date user changed --> set chart viewport
        if(props.start !== state.start_date || props.end !== state.end_date){
          return {
            start_date: props.start,
            end_date: props.end,
            longest_bullish: max_bullish,
            chart_data: chart_data_temp,
            viewport: {
              argumentStart: new Date(props.start),
              argumentEnd: new Date(props.end),
            },
          }
        } else {
          return {
            start_date: props.start,
            end_date: props.end,
            longest_bullish: max_bullish,
            chart_data: chart_data_temp,
          };
        }
      }
      // Return null to indicate no change to state.
      return null;
    }

    // Animation csv button text
    componentDidMount() {
      setTimeout(() => {
        this.setState({opacity: 1})
      }, 1000)
    }

    render() {
      // Load styles to drops
      const { classes } = this.props;
      // Load state values what needed...
      const {
        chart_data,
        viewport,
        longest_bullish,
        end_date,
        start_date,
        opacity,
      } = this.state;

      // Check - Have childern data, change showing view
      if(chart_data.length !== 0){
        return (
          <div style={{
            
            opacity: opacity,
          }}>
              <Card className={classes.card}>
                  <CardHeader
                      title="Longest bullish trend"
                      className={classes.cardTitle}
                  />
                  <CardContent>
                    <Typography variant="body1" component="p" className={classes.typography}>
                      Stock historical data the Close/Last price increased <b>{longest_bullish}</b> days in a row 
                      between <b>{start_date}</b> and <b>{end_date}</b>. Below is the per-share information in the Close/Last Price graph.
                      (You can zoom in as needed (mouse cursor table and use mouse scrolling) and daily values can be obtained from the day to line)
                    </Typography>
                    <Chart data={chart_data}>
                      <ArgumentScale factory={scaleTime} />
                      <ArgumentAxis />
                      <ValueAxis 
                        labelComponent={PriceLabel}
                      />
                      <LineSeries valueField="y" argumentField="x" />
                      <ZoomAndPan viewport={viewport} onViewportChange={this.viewportChange} />
                      <EventTracker />
                      <Tooltip />
                    </Chart> 
                  </CardContent>
              </Card>
          </div>
        )
      } else {
        return (
          <div>
              <Card className={classes.card}>
                  <CardHeader
                      title="Longest bullish trend"
                      className={classes.cardTitle}
                  />
                  <CardContent>
                    <Typography variant="body1" component="p" className={classes.typography}>
                      No Data
                    </Typography>
                  </CardContent>
              </Card>
          </div>
        )
      }
    }
}

export default withStyles(styles)(LongestBullish);