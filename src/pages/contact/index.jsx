import React from 'react';
import { Card } from 'antd';
import './index.styl';

export default function Contact() {
  const title = (<a href="https://www.researchgate.net/profile/Zhixiang_Zuo/publications">Zhixiang zuo</a>);
  return (
    <>
      <h1>Contact</h1>
      <Card title={title} bordered={false} style={{ width: '100%', margin: '3% auto', border: 'none' }}>
        <p>
          <a href="mailto:zuozhx@sysucc.org.cn">zuozhx@sysucc.org.cn</a>
        </p>
        <p>Associate Professor of Cancer Genomics</p>
        <p>Cancer Center, Sun Yat-sen University, Guangzhou 510060, China</p>
      </Card>
    </>
  );
}
