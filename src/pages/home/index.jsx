import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Card, Button, Row, Col, Input,
} from 'antd';
import './index.styl';
import searchImg from './pic.png';

const { Search } = Input;

export default function Home() {
  const history = useHistory();

  return (
    <>
      <h1 className="home">
        <span>T</span>
        <span>P</span>
        <span>G</span>
        <span>A</span>
      </h1>
      <Row justify="space-around">
        <Col span={10}>
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
        <Col span={14}>
          <div><img width="auto" src={searchImg} alt="" /></div>
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
