import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Card, Button, Row, Col, Input,
} from 'antd';
import Plot from 'react-plotly.js';
import './index.styl';

const { Search } = Input;

export default function Home() {
  const history = useHistory();

  return (
    <>
      <Row justify="center" align="middle">
        <Col span={5}>
          <Card style={{ width: '60%', margin: '3% auto', border: 'none' }}>
            <p>Welcome to TPGA!</p>
            <p>
              <span>RNA expression</span>
              ,
              {' '}
              <span>DNA methylation</span>
              {' '}
              and
              {' '}
              <span>GWAS database</span>
              {' '}
              for pain
            </p>
            <p>
              <span>4</span>
              {' '}
              species
            </p>
            <p>
              <span>42</span>
              {' '}
              datasets
            </p>
            <p>
              <span>1,290</span>
              {' '}
              samples
            </p>
            <p>
              <span>10</span>
              {' '}
              tissue type
            </p>
          </Card>
          <div className="button">
            <Button><Link to="/expression">Get started</Link></Button>
          </div>
        </Col>
        <Col span={19}>
          <Row justify="center" align="middle">
            <Col span={12}>
              <Plot
                data={[
                  {
                    values: [38, 550, 578, 95],
                    labels: ['Homo sapiens', 'Mus musculus', 'Rattus norvegicus', 'Sus scrofa'],
                    type: 'pie',
                  },
                ]}
                layout={{
                  title: 'Species',
                  width: 'auto',
                  height: 'auto',
                  paper_bgcolor: '#F9F9EC',
                  plot_bgcolor: '#F9F9EC',
                }}
              />
            </Col>
            <Col span={12}>
              <Plot
                data={[
                  {
                    values: [684, 455, 122],
                    labels: ['Expression profiling by array', 'Expression profiling by high throughput sequencing', 'Methylation profiling by high throughput sequencing'],
                    type: 'pie',
                  },
                ]}
                layout={{
                  title: 'Data Source',
                  width: 'auto',
                  height: 'auto',
                  paper_bgcolor: '#F9F9EC',
                  plot_bgcolor: '#F9F9EC',
                }}
              />
            </Col>
          </Row>
          <Row justify="center" align="middle">
            <Col span={12}>
              <Plot
                data={[
                  {
                    values: [16, 18, 137, 832, 15, 9, 210, 11, 13],
                    labels: ['Bladder', 'Blood', 'Brain', 'Dorsal root ganglion', 'Sciatic nerve', 'Skin', 'Spinal cord', 'Trigeminal ganglion', 'Urine sediment'],
                    type: 'pie',
                  },
                ]}
                layout={{
                  title: 'Tissue Type',
                  width: 'auto',
                  height: 'auto',
                  paper_bgcolor: '#F9F9EC',
                  plot_bgcolor: '#F9F9EC',
                }}
              />
            </Col>
            <Col span={12}>
              <Plot
                data={[
                  {
                    values: [6, 605, 143, 458, 25, 24],
                    labels: ['Chronic', 'Control', 'Drug', 'Injury', 'Other disease', 'Physical'],
                    type: 'pie',
                  },
                ]}
                layout={{
                  title: 'Pain Type',
                  width: 'auto',
                  height: 'auto',
                  paper_bgcolor: '#F9F9EC',
                  plot_bgcolor: '#F9F9EC',
                }}
              />
            </Col>
          </Row>
          <Search
            placeholder="Search Gene"
            enterButton="Quick Search!"
            size="large"
            // https://stackoverflow.com/a/60256650
            onSearch={(gene) => history.push({
              pathname: '/search',
              search: `?gene=${gene}`,
              state: { gene },
            })}
            style={{ width: 'auto' }}
          />
        </Col>
      </Row>
    </>
  );
}
