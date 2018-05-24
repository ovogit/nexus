#!flask/bin/python
import os
import json
import csv
from flask import Flask, jsonify, Response, request, send_file
from flask_cors import CORS
import scrapy
from scrapy.crawler import CrawlerRunner
import subprocess

path = os.path.join(os.path.dirname(__file__), 'scrapers/yp')
pathdata = os.path.join(os.path.dirname(__file__), 'scrapers/yp/data/')

app = Flask(__name__)
CORS(app)


@app.route('/ypscraper/<state>/<city>/<terms>')
def index(state, city, terms):
    spider_name = "yellowpages"
    fname = "%s-%s-%s.csv" % (state,city,terms)
    city = "city=%s" % city
    state = "state=%s" % state
    terms = "terms=%s" % terms
    data = []

    with open('lastquery.txt','w') as lastQueryFile:
        lastQueryFile.write(fname.lower())

    try:
        subprocess.check_output(['scrapy', 'crawl', spider_name,'-a', city ,'-a', state,'-a',terms, '-o', 'output.json'], cwd=path)
        fileLastCSV = open(pathdata + fname.lower())
        if fileLastCSV == None:
            raise Exception('Scrapy could not generate the csv data file')
        reader = csv.reader(fileLastCSV)
        try:
            for row in reader:
                data.append( { 
                    'name': row[0],
                    'address': row[1],
                    'phone': row[2],
                    'website': row[3]
                } )
            if len(data) == 0:
                raise Exception('No data')
        except Exception as err:
            return jsonify({'error' : str(err)})
        return jsonify({'data': data })
    except Exception as err:
        return jsonify({'error': str(err)})

@app.route('/query/last')
def querylast():
    try:
        last = open('lastquery.txt','r')
        lastCSVName = last.readlines()
        lastCSVFile = open(pathdata + lastCSVName[0].rstrip(), 'r')
        reader = csv.reader(lastCSVFile)
        data = []
        for row in reader:
            data.append( { 
                'name': row[0],
                'address': row[1],
                'phone': row[2],
                'website': row[3]
            } )
        ret = jsonify({'lastCSV': lastCSVName, 'data' : data})
    except:
        ret = jsonify({'data': 'failed'})
    return ret

@app.route('/colors')
def colors():
    colorsFile = open('api/nxs-color.json','r')
    data = None
    with open('api/nxs-color.json') as colorData:
        data = json.load( colorData )
    ret = jsonify({ 'data' : data })
    return ret

@app.route('/download/last')
def downloadlast():
    last = open('lastquery.txt','r')
    lastCSVName = last.readlines()
    path = 'scrapers/yp/data/' + lastCSVName[0].rstrip()
    return send_file(path,
            mimetype='text/csv',
            attachment_filename=lastCSVName[0].rstrip(),
            as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

