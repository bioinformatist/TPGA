import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import {
  Spin, Space, Card, Row, Col,
} from 'antd';

export default function BoxPlot(props) {
  const { gene, group } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [y0, setY0] = useState([]);
  const [y1, setY1] = useState([]);
  const [gn, setGn] = useState('');
  const [p, setP] = useState(1);
  const [fc, setFc] = useState(1);
  const [fdr, setFdr] = useState(1);

  useEffect(() => {
    fetch(`/api/plots/boxplot/${gene}-${group}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setY0(result.y0);
          setY1(result.y1);
          setGn(result.not_control);
          setP(result.p);
          setFc(result.fc);
          setFdr(result.fdr);
        },
        (e) => {
          setIsLoaded(true);
          setError(e);
        },
      );
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
      <Row justify="center" align="middle">
        <Col span={12}>
          <Plot
            data={[
              {
                y: y0,
                type: 'box',
                name: 'Control',
                boxpoints: 'all',
                jitter: 0.5,
                marker: {
                  color: '#b1d3e0',
                },
              },
              {
                y: y1,
                type: 'box',
                name: gn,
                boxpoints: 'all',
                jitter: 0.5,
                marker: {
                  color: '#659b28',
                },
              },
            ]}
            layout={{
              width: 'auto',
              height: 'auto',
              // xaxis: {
              //   tickfont: {
              //     color: '#e0ffea',
              //   },
              // },
              yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                // gridcolor: '#e0ffea',
                gridwidth: 1,
                // zerolinecolor: '#e0ffea',
                zerolinewidth: 2,
              },
              paper_bgcolor: '#F9F9EC',
              plot_bgcolor: '#F9F9EC',
              // font: {
              //   color: '#e0ffea',
              // },
              showlegend: false,
            }}
          />
        </Col>
        <Col span={12}>
          <Card title="Metrics" style={{ width: '50%', margin: '3% auto', float: 'left'}}>
            <p>
              P-value:
              {p}
            </p>
            <p>
              Fold Change:
              {fc}
            </p>
            <p>
              FDR value:
              {fdr}
            </p>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Card title="Gene Expression by Group" bordered={false} style={{ width: 'auto' }}>
      { plot }
    </Card>
  );
}

BoxPlot.propTypes = {
  gene: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
};
