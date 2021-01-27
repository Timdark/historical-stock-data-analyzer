import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import compareDesc from 'date-fns/compareDesc'

import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

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
  })

class BestOpeningPrice extends React.Component {
    // STATE
    constructor(props) {
        super(props);
        this.state = {
          table_header: [
            { name: 'date', title: 'Date' },
            { name: 'priceChange', title: 'Price change (%)' }
          ],
          table_data: [],
          start_date: "",
          end_date: "",
          defaultSorting: [{ columnName: 'priceChange', direction: 'desc' }],
          sorting: [
            { columnName: 'date', direction: 'desc' },
            { columnName: 'priceChange', direction: 'asc' },
          ],
          dateColumns: ['date'],
          pageSizes: [5, 10, 15],
          pageSize: 5,
          currentPage: 0,
        };
    }

    // Get drops and parse data to right format
    static getDerivedStateFromProps(props, state) {
      if (props.data !== state.csv_data || props.start !== state.start_date || props.end !== state.end_date) {
        let table_temp = [];  // table rows temp

        // Reverse data array content
        const reverse_data_array = props.data.map(temp => temp).reverse();

        // Make table rows
        reverse_data_array.forEach((day, i) => {
          if(day.data[0] !== "Date" && day.data[0] !== "") {  // Remove table header and empty arrays     
            // User input days range - pick days only in range      
            if(compareDesc(new Date(props.start), new Date(day.data[0])) !== -1 && compareDesc(new Date(day.data[0]), new Date(props.end)) !== -1) {
              let sma5 = 0

              // Create SMA 5 value
              if(i > 5){  // Safety - array
                // Remove string unnesesary marks, like '$'
                let d1 = reverse_data_array[i-1].data[1].substring(2)
                let d2 = reverse_data_array[i-2].data[1].substring(2)
                let d3 = reverse_data_array[i-3].data[1].substring(2)
                let d4 = reverse_data_array[i-4].data[1].substring(2)
                let d5 = reverse_data_array[i-5].data[1].substring(2)

                // Calc SMA 5
                sma5 = (parseFloat(d1) + parseFloat(d2) + parseFloat(d3) + parseFloat(d4) + parseFloat(d5)) / 5
              }

              // Remove string unnesesary marks, like '$'
              let temp_day_open = day.data[4].substring(2)

              // Row object make
              let row = {
                date: day.data[0],
                priceChange: sma5 !== 0?temp_day_open/sma5*100:"Can't calc",  // Calc price change % + safety addons
              }

              // Push object to table temp data array
              table_temp.push(row)
            }
          }           
        })
        
        // Add values to state
        return {
          start_date: props.start,
          end_date: props.end,
          table_data: table_temp,
        };
      }
  
      // Return null to indicate no change to state.
      return null;
    }

    // Change sorting state
    changeSorting = sorting => this.setState({ sorting });

    // Change current page state
    changeCurrentPage = currentPage => this.setState({ currentPage })

    // Change page size state
    changePageSize = pageSize => this.setState({ pageSize })

    // Page render
    render() {
      const { classes } = this.props;
      const {
        sorting,
        defaultSorting,
        table_data,
        table_header,
        currentPage,
        pageSize,
        pageSizes,
      } = this.state;

      return (
        <div>
            <Card className={classes.card}>
                <CardHeader
                    title="Price change percentages (SMA 5)"
                />
                <CardContent>
                  <Grid
                    rows={table_data}
                    columns={table_header}
                  >
                    <SortingState
                      sorting={sorting}
                      onSortingChange={this.changeSorting}
                      defaultSorting={defaultSorting}
                    />
                    <PagingState
                      currentPage={currentPage}
                      onCurrentPageChange={this.changeCurrentPage}
                      pageSize={pageSize}
                      onPageSizeChange={this.changePageSize}
                    />
                    <IntegratedSorting />
                    <IntegratedPaging />
                    <Table />
                    <TableHeaderRow showSortingControls />
                    <PagingPanel
                      pageSizes={pageSizes}
                    />
                  </Grid>
                </CardContent>
            </Card>
        </div>
      )
    }
}

export default withStyles(styles)(BestOpeningPrice);