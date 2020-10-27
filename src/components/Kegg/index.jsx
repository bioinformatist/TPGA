import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import {
  Spin, Space, Card,
} from 'antd';

export default function KeggPlot(props) {
  const { gene, group } = props;
  const gse = group.split('_')[1];
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [size, setSize] = useState([]);
  const [text, setText] = useState([]);
  const desiredMaximumMarkerSize = 100;

  useEffect(() => {
    fetch(`/api/plots/kegg/${gene}-${gse}`)
      .then((res) => {
        let fuckingPromise;
        if (!res.ok) {
          fuckingPromise = fetch(`/api/plots/kegg/${gene}-${group}`);
        } else {
          fuckingPromise = res;
        }
        return fuckingPromise;
      })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setX(result.x);
          setY(result.y);
          setSize(result.size);
          setText(result.text);
        },
        (e) => {
          setIsLoaded(true);
          setError(e);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gene, group]);

  let plot;

  if (error) {
    plot = (
      <div>
        Error:
        {error.message}
      </div>
    );
  } else if (!isLoaded) {
    plot = (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    );
  } else {
    plot = (
      <Plot
        data={[
          {
            x,
            y,
            mode: 'markers',
            text,
            marker: {
              size,
              sizeref: (2.0 * Math.max(...size)) / (desiredMaximumMarkerSize ** 2),
              sizemode: 'area',
              color: '#659b28',
            },
          },
        ]}
        layout={{
          width: 'auto',
          height: 'auto',
          xaxis: {
            automargin: true,
            title: {
              text: 'KEGG Pathway',
            },
            // tickfont: {
            //   color: '#e0ffea',
            // },
          },
          yaxis: {
            // color: 'black',
            // tickfont: {
            //   color: 'black',
            // },
            // autorange: true,
            showgrid: true,
            zeroline: true,
            // dtick: 5,
            // gridcolor: '#e0ffea',
            gridwidth: 1,
            // zerolinecolor: '#e0ffea',
            zerolinewidth: 2,
          },
          paper_bgcolor: '#F9F9EC',
          plot_bgcolor: '#F9F9EC',
          // font: {
          //   color: 'black',
          // },
          showlegend: false,
        }}
      />
    );
  }

  return (
    <Card title="KEGG Enrichment" bordered={false} style={{ width: 'auto' }}>
      { plot }
    </Card>
  );
}

KeggPlot.propTypes = {
  gene: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
};
