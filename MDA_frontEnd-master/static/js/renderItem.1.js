var renderItem = function(params, api) {
    var style = api.style({
      stroke: api.visual("color"),
      fill: null
    });
    return {
      type: "group",
      children: [
        {
          type: "line",
          shape: {
            x1:
              api.coord([api.value(0), api.value(1)])[0] -
              api.size([1, 0])[0] * 0.1,
            y1: api.coord([api.value(0), api.value(1)])[1],
            x2:
              api.coord([api.value(0), api.value(1)])[0] +
              api.size([1, 0])[0] * 0.1,
            y2: api.coord([api.value(0), api.value(1)])[1]
          },
          style: style
        },
        {
          type: "line",
          shape: {
            x1: api.coord([api.value(0), api.value(1)])[0],
            y1: api.coord([api.value(0), api.value(1)])[1],
            x2: api.coord([api.value(0), api.value(2)])[0],
            y2: api.coord([api.value(0), api.value(2)])[1]
          },
          style: style
        },
        {
          type: "line",
          shape: {
            x1:
              api.coord([api.value(0), api.value(2)])[0] -
              api.size([1, 0])[0] * 0.1,
            y1: api.coord([api.value(0), api.value(2)])[1],
            x2:
              api.coord([api.value(0), api.value(2)])[0] +
              api.size([1, 0])[0] * 0.1,
            y2: api.coord([api.value(0), api.value(2)])[1]
          },
          style: style
        }
      ]
    };
  };