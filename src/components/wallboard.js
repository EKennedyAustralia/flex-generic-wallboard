import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SyncClient from "../../node_modules/twilio-sync";
var initialDate = new Date()
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: 'whitesmoke',
    minHeight: '100vh',
  },
  header: {
    flexGrow: 1,
    maxHeight: '12vh',
    minHeight: '12vh',
    minWidth: '100vw',
    position: 'absolute',
    top: 0,
    background: '#263962',
    color: 'white',
    fontSize: 50,
    textAlign: 'center',
    paddingTop: '3vh',
  },
  footer: {
    flexGrow: 1,
    maxHeight: '7vh',
    minHeight: '7vh',
    minWidth: '100vw',
    position: 'absolute',
    bottom: 0,
    background: '#263962',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    paddingTop: '3vh',
  },
  container: {
    flexGrow: 1,
    maxHeight: '75vh',
    maxWidth: '80vw',
    minWidth: '80vw',
    position: 'absolute',
    left: '10vw',
    top: '25vh',
  },
  card: {
    minWidth: 275,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 20,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function NestedGrid() {
  const classes = useStyles();
  const [callsWaiting , setCallsWaiting] = useState(' - ')
  const [longestWaiting , setLongestWaiting] = useState(' - ')
  const [reservationsAccepted , setReservationsAccepted] = useState(' - ')
  const [tasksCanceled , setTasksCanceled] = useState(' - ')
  const [averageSpeedToAnswer , setAverageSpeedToAnswer] = useState(' - ')
  const [loggedinAgents , setLoggedinAgents] = useState(' - ')
  const [updateTime , setUpdateTime] = useState(initialDate.toTimeString())



  useEffect(() => {
    fetch('https://carmine-goat-9020.twil.io/syncToken')
    .then(response => response.json())
    .then(data => {
        var syncClient = new SyncClient(data.token);
            // Open a Document by unique name and update its value
        syncClient.document('dashboardStats')
        .then(document => {
            // Listen to updates on the Document
            document.on('updated', event => {
                console.log('Received Document update event. New value:', event.value);
                var statsList = event.value;
                var CallsWaiting =  statsList.workspace_statistics.realtime.tasks_by_status.pending
                var LongestWaiting = statsList.workspace_statistics.realtime.longest_task_waiting_age
                setCallsWaiting(CallsWaiting)
                setLongestWaiting(LongestWaiting)
                setReservationsAccepted(statsList.workspace_statistics.cumulative.reservations_accepted)
                setTasksCanceled(statsList.workspace_statistics.cumulative.tasks_canceled)
                setAverageSpeedToAnswer(statsList.workspace_statistics.cumulative.avg_task_acceptance_time)
                setLoggedinAgents(statsList.workspace_statistics.realtime.total_workers-statsList.workspace_statistics.realtime.activity_statistics[0].workers)
                var endTime = new Date(statsList.workspace_statistics.cumulative.end_time)
                setUpdateTime(endTime.toTimeString())
                // var timer = statsList.workspace_statistics.realtime.longest_task_waiting_age
                // setInterval (function() {
                // timer = timer+5;
                //     setLongestWaiting(timer);
                //     console.log( "set interval ran timer is: ", timer)
                // }, 5000)

            });
  
            })
    })
    setInterval (function(){
      window.location.reload(false);
      },3600000)
  });
  
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.header} gutterBottom>
          Service Desk Phone Queue
        </Typography>
      </div>
      <div className={classes.container}>
      <Grid container spacing={8}>
        <Grid container item xs={12} spacing={8}>
          <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Calls Waiting
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {callsWaiting}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Longest Waiting Call (seconds)
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {longestWaiting}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Agents Logged In
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {loggedinAgents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={8}>
        <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Answered Calls
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {reservationsAccepted}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Abandoned Calls
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {tasksCanceled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Average Speed to Answer (seconds)
                </Typography>
                <Typography variant="h1" component="h2" align="center">
                  {averageSpeedToAnswer}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      </div>
      <div className={classes.footer}>
        <Typography className={classes.footer} gutterBottom>
          Last updated at: {updateTime}
        </Typography>
      </div>
    </div>
  );
}
