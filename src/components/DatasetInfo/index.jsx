import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';
import PropTypes from 'prop-types';

export default function DatasetInfo(props) {
  const { gse } = props;
  const [pmid, setPmid] = useState(null);
  const [abstract, setAbstract] = useState(null);

  const gseHref = `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${gse}`;
  const gseA = <a href={gseHref} target="_blank" rel="noreferrer">{gse}</a>;

  useEffect(() => {
    fetch(`/api/dataset/${gse}`)
      .then((res) => res.json())
      .then((result) => {
        const pmidHref = `https://pubmed.ncbi.nlm.nih.gov/${result[gse][1]}/`;
        const pmidA = <a href={pmidHref} target="_blank" rel="noreferrer">{result[gse][1]}</a>;
        setAbstract(result[gse][0]);
        setPmid(pmidA);
      });
  }, [gse]);

  return (
    <Descriptions title="Dataset Information" bordered column={2}>
      <Descriptions.Item label="Accession">
        {gseA}
      </Descriptions.Item>
      <Descriptions.Item label="PMID">{pmid}</Descriptions.Item>
      <Descriptions.Item label="Abstract" span={2}>
        {abstract}
      </Descriptions.Item>
    </Descriptions>
  );
}

DatasetInfo.propTypes = {
  gse: PropTypes.string.isRequired,
};
