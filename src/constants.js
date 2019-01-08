import {
  scaleQuantize,
  scaleLinear
} from 'd3-scale';

export const co2LevelRange = [400, 1600];

export const co2LevelNames = scaleQuantize()
  .domain(co2LevelRange)
  .range(['best', 'good', 'normal', 'bad', 'worst']);

export const co2LevelProgress = scaleLinear()
  .domain(co2LevelRange)
  .range([1, 0])
  .clamp(true);
