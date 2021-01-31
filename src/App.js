import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';

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

import logo from './logo.svg'

import GetAppIcon from '@material-ui/icons/GetApp';

/***************************** CSS & STYLES & FORMATING ***************************/

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
    backgroundColor: '#1565C0',
    color: 'white',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
  },
  drawerContainer: {
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#CFD8DC',
    minHeight: '100vh',
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
  grid: {
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      width: '80%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '74%',
    },
    margin: 'auto',
  },
  logo: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  }
})

/****************** CLASS ***************************/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        csv_data: [],
        file_start_date: undefined,
        file_end_date: undefined,
        start_date: undefined,
        end_date: undefined,
        opacity: 0,
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
  // Save and parse file
  handleOnDrop = (data) => {
    // Save imported data to temp
    this.setState({
      csv_data: data,
      file_end_date: data[1].data[0],
      file_start_date: data[data.length - 2].data[0],
      end_date: data[1].data[0],
      start_date: data[data.length - 2].data[0],
    });
  }

  // Handle errors
  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  // Remove file
  handleOnRemoveFile = () => {};

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

  // Animation csv button text
  componentDidMount() {
    setTimeout(() => {
      this.setState({opacity: 1})
    }, 1)
  }

  /************* SITE RENDER ******************/
  render() {
    // Load styles to drops
    const { classes } = this.props;
    // Load state values what needed...
    const {
      file_end_date,
      file_start_date,
      start_date,
      end_date,
      csv_data,
      opacity,
    } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <img
              src={logo}
              alt=''
              className={classes.logo}
            />
            <Typography variant="h4" noWrap>
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
              <CSVReader
                onDrop={this.handleOnDrop}
                onError={this.handleOnError}
                accept='.csv'
                addRemoveButton
                onRemoveFile={this.handleOnRemoveFile}
                style={{
                  dropArea: {
                    borderColor: '#B6B6B6',
                    borderStyle: 'dashed',
                    borderRadius: '20px',
                    borderWidth: '2px',
                    backgroundColor: 'rgb(232 232 232)',
                    width: 200,
                    height: 40,
                    marginBottom: '25px',
                  },
                  dropAreaActive: {
                    borderColor: '#666',
                  },
                  dropFile: {
                    width: 190,
                    height: 40,
                    background: '#ccc',
                    boxShadow: '#aaa 1px 1px',
                  },
                  fileSizeInfo: {
                    color: 'black',
                    backgroundColor: '#ccc',
                    borderRadius: 3,
                    lineHeight: 1,
                    marginBottom: '0.5em',
                    padding: '0 0.4em',
                  },
                  fileNameInfo: {
                    color: 'black',
                    backgroundColor: '#ccc',
                    borderRadius: 3,
                    fontSize: 14,
                    lineHeight: 1,
                    padding: '0 0.4em',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '150px', 
                    overflow: 'hidden', 
                  },
                  removeButton: {
                    color: '#E91E63',
                    position: 'relative',
                  },
                  progressBar: {
                    backgroundColor: '#2196F3',
                    width: 50,
                    height: 4,
                  },
                }}
              >
                <div 
                  style={{
                    transition: 'opacity ease 0.5s',
                    opacity: opacity,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <GetAppIcon fontSize="large" style={{
                    position: 'relative',
                    left: '-5px',
                    top: '3px',
                    color: '#7e7e7e',
                  }} />
                  Drop CSV file here or click to upload
                </div>
              </CSVReader>
            </div>
            <Divider />
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <h3>Give date range</h3>
                <h5>Starting date</h5>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="start-date-picker-inline"
                  minDate={file_start_date}
                  maxDate={file_end_date}
                  value={start_date}
                  onChange={this.handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  InputProps={{ className: classes.input }}
                />
                <h5>Ending date</h5>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="end-date-picker-inline"
                  minDate={file_start_date}
                  maxDate={file_end_date}
                  value={end_date}
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
            className={classes.grid}
          >
            <Grid item xs={12}>
              <LongestBullish data={csv_data} start={start_date} end={end_date} />
            </Grid>
            <Grid item xs>
              <VolumeAndPrice data={csv_data} start={start_date} end={end_date} />     
            </Grid>
            <Grid item xs>
              <BestOpeningPrice data={csv_data} start={start_date} end={end_date} />
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);