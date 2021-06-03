import React from 'react';

class Display extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className='display-container col-12'>
        <h1 id="timer-label">{this.props.timeTitle}</h1>
        <h1 id="time-left">{this.props.time}</h1>
      </div>
    );
  }
}

export default Display;
