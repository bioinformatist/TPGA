#!/usr/bin/env python

from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import csv

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
        return { 'columns': col, 'data': data }

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

api.add_resource(Acute, '/tables/acute')
api.add_resource(Chroic, '/tables/chroic')
api.add_resource(Disease, '/tables/disease')
api.add_resource(Drug, '/tables/drug')

if __name__ == '__main__':
    app.run()