#!/usr/bin/env python

from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import csv
import pandas as pd
import numpy as np

app = Flask(__name__)
api = Api(app)

class Table(Resource):
    def __init__(self, filename):
        self.table = 'Handsome Zuo'
        
    def get(self):
        data = []
        for i, record in enumerate(self.table):
            if i == 0:
                col = [ {'dataIndex': x} for x in list(record.keys()) ]
            record = dict(record)
            record.update({'key': i})
            data.append(record)
        if not request.args:
            return { 'columns': col, 'data': data }
        elif request.args.get("offset"):
            offset = int(request.args.get("offset"))
            return { 'columns': col, 'data': data[offset: offset + 15] }
        else:
            gene = request.args.get("gene")
            return { 'columns': col, 'data': next(item for item in data if item["Gene"] == gene) }


class Acute(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/RNA_diff_matrix_Acute.csv'))

class Chroic(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/RNA_diff_matrix_Chroic.csv'))

class Disease(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/RNA_diff_matrix_Disease.csv'))

class Drug(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/RNA_diff_matrix_Drug.csv'))

class CpgAcute(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/CpG_FC_merge_acute.csv'))

class CpgChroic(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/CpG_FC_merge_chronic.csv'))

class GeneInfo(Resource):
    def __init__(self):
        self.data = {}
        table = csv.DictReader(open('tables/gene_info_output.csv'))
        for record in list(table):
            record = dict(record)
            record_melt = []
            for i, (k, v) in enumerate(record.items()):
                if k != 'Org':
                    record_melt.append({'name': k, 'value': v, 'key': i})
            self.data.update({'-'.join([record['Org'], record['Gene symbol']]): record_melt})
    
    def get(self, gene, org):
        return(self.data['-'.join([org, gene])])

class Boxplot(Resource):
    def __init__(self, type):
        if type == 'expression':
            self.group_sample = pd.read_csv('tables/sample_group2.csv', float_precision = 'round_trip')
            self.expression = pd.read_csv('tables/RNA_exp_all.csv', float_precision = 'round_trip')
            self.diff = pd.read_csv('tables/all_diff_exp_2.csv', float_precision = 'round_trip')
        else:
            self.group_sample = pd.read_csv('tables/methy_group3', float_precision = 'round_trip')
            self.expression = pd.read_csv('tables/meth_matrix_output.csv', float_precision = 'round_trip')
            # self.diff = pd.read_csv('tables/', float_precision = 'round_trip')
        
    def get(self, gene, group):
        factors = self.group_sample.loc[(self.group_sample['group2'] == group), ['group']].iloc[:, 0].unique()
        not_control = factors[factors != 'Con'][0]
        y0 = self.expression.loc[(self.expression['gene'] == gene) & (self.expression['variable'].isin(self.group_sample.loc[(self.group_sample['group2'] == group) & (self.group_sample['group'] == 'Con'), ['sample']].iloc[:, 0])), ['value']].iloc[:, 0].tolist()
        y1 = self.expression.loc[(self.expression['gene'] == gene) & (self.expression['variable'].isin(self.group_sample.loc[(self.group_sample['group2'] == group) & (self.group_sample['group'] == not_control), ['sample']].iloc[:, 0])), ['value']].iloc[:, 0].tolist()
        p = self.diff.loc[(self.diff['ID'] == group) & (self.diff['gene'] == gene), ['p']].values.item()
        fc = self.diff.loc[(self.diff['ID'] == group) & (self.diff['gene'] == gene), ['log2FC']].values.item()
        fdr = self.diff.loc[(self.diff['ID'] == group) & (self.diff['gene'] == gene), ['fdr']].values.item()
        return {'not_control': not_control, 'y0': y0, 'y1': y1, 'p': p, 'fc': fc, 'fdr': fdr}

class Gwas(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/GWAS_merge.csv'))

class Corr(Resource):
    def get(self, gene, group):
        with open('tables/' + group + '.top100_corr.csv') as f:
            corrs = f.readlines()

        gene_corr = {}
        for corr in corrs:
            corr = corr.rstrip().split(',')
            if corr[0] in gene_corr:
                gene_corr[corr[0]].append([corr[1], corr[2]])
            else:
                gene_corr[corr[0]] = [[corr[1], corr[2]]]

        nodes = [{'name': gene, 'symbolSize': 10, 'value': 1, "category": 'Gene', "label": {"normal": {"show": "True"}}}]
        links = []
        for gc in gene_corr[gene]:
            gc[1] = float(gc[1])
            if gc[1] > 0:
                nodes.append({'name': gc[0], 'value': gc[1], 'symbolSize': gc[1], 'category': 'Positive correlation', "label": {"normal": {"show": "True"}}})
            else:
                nodes.append({'name': gc[0], 'value': gc[1], 'symbolSize': -gc[1], 'category': 'Negtive correlation', "label": {"normal": {"show": "True"}}})
            links.append({'source': gene, 'target': gc[0]})
        return {'nodes': nodes, 'links': links, 'categories': [{'name': 'Gene'}, {'name': 'Positive correlation'}, {'name': 'Negtive correlation'}]}

class Kegg(Resource):
    def get(self, gene, group):
        kegg = pd.read_csv('tables/' + group + '.top100_kegg.csv')
        kegg['p.adjust'] = -np.log10(kegg['p.adjust'])
        return {'x': kegg[kegg['gene1'] == gene]['Description'].to_list(), 'y': kegg[kegg['gene1'] == gene]['p.adjust'].to_list(), 'size': kegg[kegg['gene1'] == gene]['Count'].to_list(), 'text': ['Gene Number: ' + str(x) for x in kegg[kegg['gene1'] == gene]['Count'].to_list()]}

class SearchedExpression(Resource):
    def get(self, gene, org):
        table = pd.read_csv('tables/all_diff_exp_2.csv', float_precision = 'round_trip')
        table = pd.concat([table, table.ID.str.extract(r'(?P<org>.+?):(?P<tissue>.+?):.+:(?P<type>.+) vs')], axis = 1)
        table = table[(table.gene == 'BDNF') & (table.org == 'Rattus norvegicus') & (table.p < 0.05)]
        # https://stackoverflow.com/a/26838140
        table = table.replace(np.nan, '-', regex=True)
        res = {}
        all_type = table.type.unique().tolist()
        res.update({'all_type': all_type})
        for t in all_type:
            tissues = table[table.type == t].tissue.unique().tolist()
            res[t] = {'all_tissue': tissues}
            for tissue in tissues:
                table_for_jsonify = table[(table.type == t) & (table.tissue == tissue)].drop(columns=['type', 'tissue', 'org', 'gene'])
                table_for_jsonify['key'] = range(0, len(table_for_jsonify))
                res[t].update({tissue: {'col': [{"dataIndex": 'log2FC', 'title': 'log2FC'}, {"dataIndex": 'p', 'title': 'P-value'}, {"dataIndex": 'fdr', 'title': 'FDR'}], 'data': table_for_jsonify.to_dict(orient = 'records')}})
        return res

class DatasetInfo(Resource):
    def get(self, dataset):
        with open('tables/dataset_description.tsv') as f:
            gses = f.readlines()

        gse_content = {}
        for gse in gses:
            gse = gse.rstrip().split('\t')
            if gse[0] in gse_content:
                gse_content[gse[0]].append([gse[1], gse[2]])
            else:
                gse_content[gse[0]] = [gse[1], gse[2]]
        
        return {dataset: gse_content[dataset]}

api.add_resource(Acute, '/api/tables/acute')
api.add_resource(Chroic, '/api/tables/chroic')
api.add_resource(Disease, '/api/tables/disease')
api.add_resource(Drug, '/api/tables/drug')
api.add_resource(GeneInfo, '/api/tables/gene-info/<org>-<gene>')
api.add_resource(Boxplot, '/api/plots/boxplot/<type>/<gene>-<group>')
api.add_resource(Gwas, '/api/tables/gwas')
api.add_resource(Corr, '/api/plots/corr/<gene>-<group>')
api.add_resource(Kegg, '/api/plots/kegg/<gene>-<group>')
api.add_resource(DatasetInfo, '/api/dataset/<dataset>')
api.add_resource(SearchedExpression, '/api/tables/searched-expression/<org>-<gene>')
api.add_resource(CpgAcute, '/api/tables/cpgacute')
api.add_resource(CpgChroic, '/api/tables/cpgchroic')

if __name__ == '__main__':
    app.run()