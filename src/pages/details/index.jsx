import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import GeneBasicInfo from '../../components/GeneBasicInfo';
import BoxPlot from '../../components/BoxPlot';
import Corr from '../../components/Corr';
import Kegg from '../../components/Kegg';
import './index.styl';

export default function Details(props) {
  const { gene, group, visible } = props;
  const [newVisible, setnewVisible] = useState(visible);
  // https://stackoverflow.com/a/54866051
  useEffect(() => {
    setnewVisible(visible);
  }, [gene, group, visible]);

  const g = group.split(':').filter((f) => f.includes('GPL') || f.includes('GSE'));
  const gName = g.length === 2 ? g.join('_') : g[0];

  return (
    <Modal
      title={`${gene}-${group}`}
      visible={newVisible}
      onCancel={() => setnewVisible(false)}
      destroyOnClose
      footer={null}
      width="auto"
    >
      <GeneBasicInfo
        gene={gene}
        org={group.split(':')[0]}
      />
      <BoxPlot
        gene={gene}
        group={group}
      />
      <Corr
        gene={gene}
        group={gName}
      />
      <Kegg
        gene={gene}
        group={gName}
      />
    </Modal>
  );
}

Details.propTypes = {
  gene: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};
