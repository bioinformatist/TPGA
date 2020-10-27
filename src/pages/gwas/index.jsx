import React from 'react';
import SimpleLazyTable from '../../components/SimpleLazyTable';

export default function Gwas() {
  return (
    <>
      <h2>GWAS</h2>
      <SimpleLazyTable
        table="gwas"
      />
    </>
  );
}
