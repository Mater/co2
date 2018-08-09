import React, { Component } from 'react';
import PropType from 'prop-types';

import { scaleLinear, scaleTime } from '@vx/scale';
import { curveNatural } from '@vx/curve';
import { AreaClosed } from '@vx/shape';

/**
 * Area diargramm
 * @extends {React.Component}
 */
class Area extends Component {
  /**
   * Renders diagram component
   * @returns {XML} diagram markup
   */
  render() {
    const { data } = this.props;
    const x = item => (item.date || 0);
    const y = item => (item.level || 0);
    const xScale = scaleTime({
      range: [0, 500],
      domain: [Date.now() - 360000, Date.now()]
    });
    const yScale = scaleLinear({
      range: [300, 0],
      domain: [0, 2000]
    });

    return (
      <div>
        <svg width={500} height={300}>
          <rect
            width={500}
            height={300}
            fill="#32deaa"
          />
          <AreaClosed
            data={data}
            xScale={xScale}
            yScale={yScale}
            x={x}
            y={y}
            strokeWidth={1}
            stroke="white"
            curve={curveNatural}
          />
        </svg>
      </div>
    );
  }
}

Area.propTypes = {
  data: PropType.arrayOf(
    PropType.shape({
      date: PropType.number,
      close: PropType.number
    })
  )
};

Area.defaultProps = {
  data: []
};

export default Area;
