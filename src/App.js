import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';

import LongestBullish from './components/LongestBullish';
import VolumeAndPrice from './components/VolumeAndPrice';
import BestOpeningPrice from './components/BestOpeningPrice';

import { CSVReader } from 'react-papaparse'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format'

const drawerWidth = 240;  // Left drawer width

/****************** STYLES ***********************/
const styles = theme => ({
  root: {
    display: 'flex',
    '& .MuiTextField-root': {
      width: 200,
    },
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    alignItems: 'center',
  },
  drawerContainer: {
    overflow: 'auto',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    alignItems: 'center',
    padding: '0 8px',
  },
  input: {
    width: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})

/****************** CLASS ***************************/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        file_name: "none",
        csv_data: [],
        file_start_date: undefined,
        file_end_date: undefined,
        start_date: undefined,
        end_date: undefined,
    };
  }

  /**************** DIALOG *******************/
  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  /****************** IMPORT CSV-FILE **************/
  handleOnDrop = async (data, file) => {
    console.log('---------------------------')
    console.log(file.name)
    console.log(data)
    console.log('---------------------------')

    await this.setState({
      file_name: file.name,
      csv_data: data,
      file_end_date: data[1].data[0],
      file_start_date: data[data.length - 2].data[0],
      end_date: data[1].data[0],
      start_date: data[data.length - 2].data[0],
    });
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  /************* DATE PICKERS ****************/
  handleStartDateChange = (date) => {
    let date_temp = format(date, 'MM/dd/yyyy')  // Change date format
    this.setState({
      start_date: date_temp
    })
  };

  handleEndDateChange = (date) => {
    let date_temp = format(date, 'MM/dd/yyyy')  // Change date format
    this.setState({
      end_date: date_temp
    })
  };

  /************* SITE RENDER ******************/
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Historical stock data analyzer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <div>
              <h3>Import CSV-file</h3>
              <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Add CSV-file
              </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="import-csv-file"
              >
                <DialogTitle id="import-csv-file">Import CSV-file</DialogTitle>
                <DialogContent>
                  <CSVReader
                    onDrop={this.handleOnDrop}
                    onError={this.handleOnError}
                  >
                    <span>Drop CSV file here or click to upload.</span>
                  </CSVReader>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary" autoFocus>
                    Done
                  </Button>
                </DialogActions>
              </Dialog>
              <h5>Imported file: {this.state.file_name}</h5>
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <h3>Checking date range</h3>
                <h6>Starting date</h6>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="start-date-picker-inline"
                  minDate={this.state.file_start_date}
                  maxDate={this.state.file_end_date}
                  value={this.state.start_date}
                  onChange={this.handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  InputProps={{ className: classes.input }}
                />
                <h6>Ending date</h6>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="end-date-picker-inline"
                  minDate={this.state.file_start_date}
                  maxDate={this.state.file_end_date}
                  value={this.state.end_date}
                  onChange={this.handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  InputProps={{ className: classes.input }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Grid 
            container 
            spacing={1}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={12}>
              <LongestBullish data={this.state.csv_data} start={this.state.start_date} end={this.state.end_date} />
            </Grid>
            <Grid item xs={12}>
              <VolumeAndPrice data={this.state.csv_data} start={this.state.start_date} end={this.state.end_date} />     
            </Grid>
            <Grid item xs={12}>
              <BestOpeningPrice data={this.state.csv_data} start={this.state.start_date} end={this.state.end_date} />
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);