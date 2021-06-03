import React from 'react';
import Title from './Title.jsx';
import Display from './Display.jsx';

let timerInterval = '';

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor((sec_num) / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

class Clock extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      timerLabel: 'session',
      timeDisplay: '25:00',
      seconds: 1500,
      breakLength: 5,
      sessionLength: 25
    }
    this.timerStart = this.timerStart.bind(this);
    this.handlePlayAndPause = this.handlePlayAndPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
  }

  handleSessionDecrement(){
    let sessionLength = this.state.sessionLength;
    if(sessionLength > 1){
      sessionLength-= 1;
    }
    this.setState({
      sessionLength
    });

    if (!timerInterval){
      let newTimeSession = sessionLength * 60;
      let newTimeSessionStr = newTimeSession.toString();
      let newSession = newTimeSessionStr.toHHMMSS();

      this.setState({
        seconds: newTimeSession,
        timeDisplay: newSession,
      })
    }
  }

  handleSessionIncrement(){
    let sessionLength = this.state.sessionLength;
    if(sessionLength < 60){
      sessionLength+= 1;
    }

    this.setState({
      sessionLength
    });

    if (!timerInterval){
      let newTimeSession = sessionLength * 60;
      let newTimeSessionStr = newTimeSession.toString();
      let newSession = newTimeSessionStr.toHHMMSS();

      this.setState({
        seconds: newTimeSession,
        timeDisplay: newSession,

      })
    }
  }


  handleBreakDecrement(){
    let breakLength = this.state.breakLength;
    if (breakLength > 1){
        breakLength-= 1;
    }

    this.setState({
      breakLength
    })
  }

  handleBreakIncrement(){
    let breakLength = this.state.breakLength;

    if (breakLength < 60){
          breakLength+= 1;
    }

    this.setState({
      breakLength
    })
  }

  handlePlayAndPause(){
    if(!timerInterval){
      timerInterval = setInterval(this.timerStart, 1000);
    }
    else{
      clearInterval(timerInterval);
        timerInterval = ''
    }
  }

  handleReset(){
    this.setState({
      timerLabel: 'session',
      timeDisplay: '25:00',
      seconds: 1500,
      breakLength: 5,
      sessionLength: 25
    })

    if (timerInterval){
      clearInterval(timerInterval);
        timerInterval = ''
    }
    let alarm = document.getElementById('beep');
    alarm.pause();
    alarm.currentTime = 0;
  }

  timerStart(){
    let timeDisplay = this.state.timeDisplay;
    let change = false;

    if(timerInterval){
      let seconds = this.state.seconds;
      seconds-= 1;
      let numberStr = seconds.toString();
      let timeDisplay = numberStr.toHHMMSS();
      console.log(seconds)
      this.setState({
        seconds,
        timeDisplay: timeDisplay
      });

      if(this.state.timeDisplay === '00:59'){
        let oneMinLeft = document.getElementById('time-left');
        oneMinLeft.classList.add('one-left');
      }

      if(this.state.timeDisplay === '0-1:59' && this.state.timerLabel === 'session'){
          let breakNumber = (this.state.breakLength * 60) ;
          let breakStr = breakNumber.toString();
          let newTimeDisplay = breakStr.toHHMMSS();

          this.setState({
            timerLabel: 'break',
            timeDisplay: newTimeDisplay,
            seconds: breakNumber,
          });
          let alarm = document.getElementById('beep');
          alarm.play();
      }

      if(this.state.timeDisplay === '0-1:59' && this.state.timerLabel === 'break'){
          let sessionNumber = (this.state.sessionLength * 60) ;
          let sessionStr = sessionNumber.toString();
          let newTimeDisplay = sessionStr.toHHMMSS();

          this.setState({
            timerLabel: 'session',
            timeDisplay: newTimeDisplay,
            seconds: sessionNumber,
          });
          let alarm = document.getElementById('beep');
          alarm.play();
      }
    }
  }

  render(){
    return(
      <div className='clock-container container w-auto'>
        <Title />
        <div className='row'>
              <div id='break-container' className='col-6'>
                <div className='row'>
                  <h2 id="break-label" className='col-12'>Break Length</h2>
                </div>
                <div className='row'>
                  <div id="break-decrement" className='col-4 button' onClick={this.handleBreakDecrement}><h1>-</h1></div>
                  <h1 id='break-length' className='col-4'><h1>{this.state.breakLength}</h1></h1>
                  <div id="break-increment" className='col-4 button' onClick={this.handleBreakIncrement}><h1>+</h1></div>
                </div>
              </div>
              <div id='session-container' className='col-6'>
                <div className='row'>
                  <h2 id="session-label" className='col-12'>Session Length</h2>
                </div>
                <div className='row'>
                  <div id="session-decrement" className='col-4 button' onClick={this.handleSessionDecrement}><h1>-</h1></div>
                  <h1 id='session-length' className='col-4'><h1>{this.state.sessionLength}</h1></h1>
                  <div id="session-increment" className='col-4 button' onClick={this.handleSessionIncrement}><h1>+</h1></div>
                </div>
              </div>
        </div>
        <div className='row'>
          <Display timeTitle={this.state.timerLabel} time={ this.state.timeDisplay}/>
        </div>
        <div className='controls'>
          <button id="start_stop" className='btn btn-outline-danger' onClick={this.handlePlayAndPause}>play/pause</button>
          <button id="reset" className='btn btn-outline-success' onClick={this.handleReset}>reset</button>
        </div>
        <audio id="beep" src='sounds/alarm.mp3'></audio>
      </div>
    );
  }
}

export default Clock;
