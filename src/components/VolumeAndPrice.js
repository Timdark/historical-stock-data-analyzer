import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import compareDesc from 'date-fns/compareDesc'
import format from 'date-fns/format'

import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

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
  },
  cardTitle: {
    color: 'white',
    backgroundColor: '#1976D2',
    textAlign: 'left',
    padding: 20,
  },
})

// Table header row content style
const TableHeaderContentBase = ({
  column,
  children,
  classes,
  ...restProps
}) => (
  <TableHeaderRow.Content
    column={column}
    {...restProps}
    style={{ color: '#444', fontSize: '14px', fontWeight: 'bold' }}
  >
    {children}
  </TableHeaderRow.Content>
);

// Table header row content style
export const TableHeaderContent = withStyles(styles, {
  name: 'TableHeaderContent',
})(TableHeaderContentBase);

// Date formating
const DateFormatter = ({ value }) =>
  value !== null ? format(new Date(value), 'MM/dd/yyyy') : value;

  // Date formating
const DateTypeProvider = props => (
  <DataTypeProvider formatterComponent={DateFormatter} {...props} />
);

/*************************************** CLASS ******************************************/
class VolumeAndPrice extends React.Component {
    // STATE
    constructor(props) {
        super(props);
        this.state = {
            table_header: [
              { name: 'date', title: 'Date' },
              { name: 'volume', title: 'Volume' },
              { name: 'priceChange', title: 'Price change ($)' }
            ],
            table_data: [],
            start_date: "",
            end_date: "",
            defaultSorting: [{ columnName: 'priceChange', direction: 'desc' }],
            sorting: [
              { columnName: 'volume', direction: 'desc' },
              { columnName: 'priceChange', direction: 'desc' },
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

          // Make table rows
          props.data.forEach((day) => {
            if(day.data[0] !== "Date" && day.data[0] !== "") {  // Remove table header and empty arrays     
              // User input days range - pick days only in range      
              if(compareDesc(new Date(props.start), new Date(day.data[0])) !== -1 && compareDesc(new Date(day.data[0]), new Date(props.end)) !== -1) {

                // Remove string unnesesary marks, like '$'
                let temp_high = day.data[4].substring(2)
                let temp_low = day.data[5].substring(2)
                let volume = day.data[2].substring(2)

                // Row object make
                let row = {
                  date: format(new Date(day.data[0]), 'yyyy/MM/dd'),  // Need convert table lib understand format
                  volume: parseFloat(volume),
                  priceChange: Math.abs(parseFloat(temp_high) - parseFloat(temp_low)).toFixed(4),
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
      // Load styles to drops
      const { classes } = this.props;
      // Load state values what needed...
      const {
        sorting,
        defaultSorting,
        table_data,
        table_header,
        currentPage,
        pageSize,
        pageSizes,
        dateColumns,
      } = this.state;

      return (
          <div>
              <Card className={classes.card}>
                  <CardHeader
                      title="Highest trading volume and price changes"
                      className={classes.cardTitle}
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
                      <DateTypeProvider for={dateColumns} />
                      <Table />
                      <TableHeaderRow 
                        showSortingControls 
                        contentComponent={TableHeaderContent}
                      />
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

export default withStyles(styles)(VolumeAndPrice);