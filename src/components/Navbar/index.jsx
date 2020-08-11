import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

export default () => (
  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} defaultOpenKeys={['1']}>
    <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
    <Menu.Item key="2"><Link to="/explorer">Explorer</Link></Menu.Item>
    <Menu.Item key="3">Statistics</Menu.Item>
    <Menu.Item key="4">Download</Menu.Item>
    <Menu.Item key="5">Contact</Menu.Item>
  </Menu>
);
