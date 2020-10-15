import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './index.styl';

export default () => (
  <Menu theme="dark" mode="horizontal">
    <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
    <Menu.Item key="2"><Link to="/search">Search</Link></Menu.Item>
    <Menu.Item key="3"><Link to="/expression">Expression</Link></Menu.Item>
    <Menu.Item key="4"><Link to="/gwas">GWAS</Link></Menu.Item>
    <Menu.Item key="5"><Link to="/cpg">CpG Methylation</Link></Menu.Item>
    <Menu.Item key="6"><Link to="/contact">Contact</Link></Menu.Item>
  </Menu>
);
