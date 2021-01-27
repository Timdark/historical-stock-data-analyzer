import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import compareDesc from 'date-fns/compareDesc'

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
      width: '40%',
      textAlign: 'left',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '10px',
      marginTop: '10px',
    },
    cardContent: {
      padding: 20,
    },
    cardTitle: {
      backgroundColor: '#457883',
      textAlign: 'left',
      padding: 20,
    },
    typography: {
      noWrap: false,
      wordWrap: "break-word"
    }
  })

// CLASS
class LongestBullish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: "",
            end_date: "",
            longest_bullish: ""
        };
    }

    static getDerivedStateFromProps(props, state) {
      if (props.data !== state.csv_data || props.start !== state.start_date || props.end !== state.end_date) {
        let bullish_temp = 0;
        let max_bullish = 1;
        let last_day_data = 0.0;

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
            }
          }           
        })

        // Save parsed data to state
        return {
          start_date: props.start,
          end_date: props.end,
          longest_bullish: max_bullish,
        };
      }
      // Return null to indicate no change to state.
      return null;
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title="Longest bullish trend"
                    />
                    <CardContent>
                        <Typography variant="body1" component="p" className={classes.typography}>
                          Stock historical data the Close/Last price increased <b>{this.state.longest_bullish}</b> days in a row 
                          between <b>{this.state.start_date}</b> and <b>{this.state.end_date}</b>.  
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(LongestBullish);