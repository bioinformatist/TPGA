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
      <Row>
        <Col span={17}>
          <Plot
            data={[
              {
                y: y0,
                type: 'box',
                name: 'Control',
                boxpoints: 'all',
                jitter: 0.5,
              },
              {
                y: y1,
                type: 'box',
                name: gn,
                boxpoints: 'all',
                jitter: 0.5,
              },
            ]}
            layout={{
              width: 'auto',
              height: 'auto',
              xaxis: {
                tickfont: {
                  color: 'white',
                },
              },
              yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'white',
                gridwidth: 1,
                zerolinecolor: 'white',
                zerolinewidth: 2,
              },
              paper_bgcolor: 'black',
              plot_bgcolor: 'black',
              font: {
                color: 'white',
              },
              showlegend: false,
            }}
          />
        </Col>
        <Col span={7}>
          <Card title="Metrics" style={{ width: 'auto', margin: '3% auto' }}>
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
