import React from 'react';
import SimpleLazyTable from '../../components/SimpleLazyTable';

export default function Gwas() {
  return (
    <>
      <h1>GWAS</h1>
      <SimpleLazyTable
        table="gwas"
      />
    </>
  );
}
