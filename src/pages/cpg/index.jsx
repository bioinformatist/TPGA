import React from 'react';
import LazyTable from '../../components/LazyTable';

export default function Cpg() {
  return (
    <>
      <h1>CpG Methylation</h1>
      <LazyTable
        table="cpg"
      />
    </>
  );
}
