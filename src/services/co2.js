import SerialPort from 'serialport';
import beep from 'beeper';

const READ_CO2_LEVEL = Buffer.from([0xff, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79]);

let port = null;

/**
 * Gets all available ports
 * @returns {Object[]} port list
 */
export async function getAvailablePorts() {
  const ports = await SerialPort.list();
  const portNames = ports.map(port => ({
    path: port.comName,
    name: `${port.comName} ${port.manufacturer}`
  }));

  return portNames;
}

/**
 * Returns current port
 * @returns {Object} port
 */
export function getCurrentPort() {
  return port;
}


/**
 * Creates port for reading sensor data
 * @param {String} portPath - Port path in OS
 * @returns {Object} port object
 */
export function openPort(portPath) {
  port = new SerialPort(portPath, {
    baudRate: 9600
  });

  beep();

  return port;
}

/**
 * Closes port
 * @returns {void}
 */
export function closePort() {
  if (port) {
    port.close();
  }
}

/**
 * Reads co2 level from current sensor
 * @returns {Promise} Promise with co2 level value
 */
export async function readCo2Level() {
  port.write(READ_CO2_LEVEL);

  const sensorValue = await readSensorValue();
  const co2Level = calcCo2Level(sensorValue);

  return co2Level;
}

/**
 * Reads sensor value after command sending
 * @returns {Promise} Promise with sensor value
 */
function readSensorValue() {
  return new Promise(resolve => {
    let buffer = Buffer.from([]);

    port.on('readable', () => {
      const read = port.read();
      buffer = Buffer.concat([buffer, Buffer.from(read)]);

      if (buffer.length >= 9) {
        port.removeAllListeners('readable');
        resolve(buffer);
      }
    });
  });
}

/**
 * Calculate CO2 level from sensor answer
 * @param {Buffer} answer - Sensor answer
 * @returns {Number} CO2 level value
 */
function calcCo2Level(answer) {
  const highByte = answer[2];
  const lowByte = answer[3];
  const co2Level = highByte * 256 + lowByte;

  return co2Level;
}
