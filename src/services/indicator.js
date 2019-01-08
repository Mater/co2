import electron from 'electron';
import { co2LevelProgress } from '../constants';

/**
 * Sets co2 level to progress bar
 * @param {Number} co2Level - CO2 level
 * @returns {void}
 */
export function setCo2Level(co2Level) {
  const progressValue = co2LevelProgress(co2Level);

  electron
    .remote
    .getCurrentWindow()
    .setProgressBar(progressValue);
}
