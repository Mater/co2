import { scaleQuantize } from 'd3-scale';

export const co2LevelNames = scaleQuantize()
  .domain([400, 1600])
  .range(['best', 'good', 'normal', 'bad', 'worst']);
