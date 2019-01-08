import React, {Component} from 'react';
import {
  getAvailablePorts,
  openPort,
  closePort,
  readCo2Level
} from '../../services/co2';
import {
  setCo2Level as setCo2LevelAtTaskbar
} from '../../services/indicator';
import {co2LevelNames} from '../../constants';

import Area from '../../components/Area';

import './Co2.css';

/**
 * CO2 value visualizer
 * @extends {React.Component}
 */
class Co2 extends Component {
  /**
   * Sets default state
   * @constructor
   */
  constructor() {
    super();

    this.co2LevelUpdating = null;
    this.state = {
      currentPort: '',
      availablePorts: [],
      co2Level: 0,
      levelHistory: []
    };

    this.updateCo2Level = this.updateCo2Level.bind(this);
    this.changePort = this.changePort.bind(this);
    this.openPort = this.openPort.bind(this);
  }

  /**
   * Open port and init updating sensor value
   * @returns {void}
   */
  async componentDidMount() {
    const ports = await getAvailablePorts();

    this.setState({
      availablePorts: ports
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {currentPort: prevPort} = prevState;
    const {currentPort} = this.state;

    if (prevPort !== currentPort) {
      this.openPort(currentPort);
    }
  }

  /**
   * Clears updating interval and close port
   * @returns {void}
   */
  componentWillUnmount() {
    clearInterval(this.co2LevelUpdating);

    closePort();
  }

  /**
   * Reads value and update it
   * @returns {void}
   */
  async updateCo2Level() {
    const {levelHistory} = this.state;

    const co2Level = await readCo2Level();
    const date = Date.now();

    const historyItem = {
      date,
      level: co2Level
    };

    this.setState({
      co2Level,
      levelHistory: [...levelHistory, historyItem]
    });
  }

  changePort(event) {
    const {value} = event.target;

    this.setState({
      currentPort: value
    });
  }

  openPort(port) {
    if (this.co2LevelUpdating) {
      clearInterval(this.co2LevelUpdating);
    }

    closePort();
    openPort(port);

    this.co2LevelUpdating = setInterval(this.updateCo2Level, 2000);
  }

  /**
   * Renders component
   * @returns {XML} component markup
   */
  render() {
    const {
      currentPort,
      co2Level,
      levelHistory,
      availablePorts
    } = this.state;
    const levelName = co2LevelNames(co2Level);

    setCo2LevelAtTaskbar(co2Level);

    return (
      <div>
        <select
          name="currentPort"
          value={currentPort}
          onChange={this.changePort}
        >
          <option value="">Not selected</option>
          {
            availablePorts.map(port => (
              <option key={port.path} value={port.path}>
                {port.name}
              </option>
            ))
          }
        </select>
        <div className={`co2 ${levelName}`}>
          {co2Level}
        </div>
        <Area data={levelHistory}/>
      </div>
    );
  }
}

export default Co2;
