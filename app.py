#!/usr/bin/env python

from flask import Flask, request
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
    def __init__(self):
        self.group_sample = pd.read_csv('tables/sample_group2.csv')
        self.expression = pd.read_csv('tables/RNA_exp_all.csv')
        self.diff = pd.read_csv('tables/all_diff_exp_2.csv')
        
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

class Cpg(Table):
    def __init__(self):
        self.table = csv.DictReader(open('tables/CpG_FC_merge.csv'))

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


api.add_resource(Acute, '/api/tables/acute')
api.add_resource(Chroic, '/api/tables/chroic')
api.add_resource(Disease, '/api/tables/disease')
api.add_resource(Drug, '/api/tables/drug')
api.add_resource(GeneInfo, '/api/tables/gene-info/<org>-<gene>')
api.add_resource(Boxplot, '/api/plots/boxplot/<gene>-<group>')
api.add_resource(Gwas, '/api/tables/gwas')
api.add_resource(Cpg, '/api/tables/cpg')
api.add_resource(Corr, '/api/plots/corr/<gene>-<group>')
api.add_resource(Kegg, '/api/plots/kegg/<gene>-<group>')

if __name__ == '__main__':
    app.run()