#!flask/bin/python
import os
import json
import csv
from flask import Flask, jsonify, Response, request, send_file
from flask_cors import CORS
import subprocess

path = os.path.join(os.path.dirname(__file__), 'scrapers/yp')
pathdata = os.path.join(os.path.dirname(__file__), 'scrapers/yp/data/')

app = Flask(__name__)
CORS(app)


@app.route('/ypscraper/<state>/<city>/<terms>')
def index(state, city, terms):
    spider_name = "yellowpages"
    fname = "%s-%s-%s.csv" % (state, city, terms)
    city = "city=%s" % city
    state = "state=%s" % state
    terms = "terms=%s" % terms
    data = []

    try:
        with open('lastquery.txt', 'w') as lastQueryFile:
            lastQueryFile.write(fname.lower())
    except:
        return jsonify({ 'error': 'Problem writing to lastquery.txt' })

    try:
        subprocess.check_output(['scrapy', 'crawl', spider_name,'-a', city ,'-a', state,'-a',terms, '-o', 'output.json'], cwd=path)
    except Exception as err:
        return jsonify({ 'error': 'Scraper process failed to initialize'})

    try:
        with open(pathdata + fname.lower()) as fileLastCSV:
            reader = csv.reader(fileLastCSV)
            for row in reader:
                data.append({ 
                    'name': row[0],
                    'address': row[1],
                    'phone': row[2],
                    'website': row[3]
                    })
        if len(data) == 0:
            raise Exception('No data')
        return jsonify({'data': data })
    except Exception as err:
        return jsonify({'error': 'No results'})

@app.route('/download/csv/<csvfile>')
def downloadcsv(csvfile):
    csv = csvfile
    csvpath = 'scrapers/yp/data/' + csv
    try:
        return send_file(csvpath,
                mimetype='text/csv',
                attachment_filename=csv,
                as_attachment=True)
    except Exception as err:
        return jsonify({ 'error': 'File does not exist %s' % csvpath})

@app.route('/query/csvs')
def querycsvs():
    data = []
    for root, dirs, files in os.walk(pathdata):
        for f in files:
            fullname = f
            if os.path.getsize(pathdata + fullname) == 0 and fullname.endswith('.html') == False:
                os.remove(pathdata + fullname)
            else:
                if fullname.endswith('.html') == False:
                    data.append(f)
    return jsonify({'data': data})

@app.route('/query/last')
def querylast():
    try:
        with open('lastquery.txt','r') as lastQuery:
            lastCSVName = lastQuery.readlines()
    except:
        return jsonify({'error': 'Could not read last csv name from lastquery.txt'})
    try:
        with open(pathdata + lastCSVName[0].rstrip(), 'r') as lastCSVFile:
            reader = csv.reader(lastCSVFile)
            data = []
            for row in reader:
                data.append({ 
                    'name': row[0],
                    'address': row[1],
                    'phone': row[2],
                    'website': row[3]
                })
        return jsonify({'lastCSV': lastCSVName, 'data' : data})
    except:
        return jsonify({'error': 'No recent queries'})

@app.route('/colors')
def colors():
    data = None
    try:
        with open('api/nxs-color.json') as colorData:
            data = json.load( colorData )
        return jsonify({ 'data' : data })
    except:
        return jsonify({ 'error' : 'Colors could not be loaded'})

@app.route('/download/last')
def downloadlast():
    with open('lastquery.txt', 'r') as lastQuery:
        lastCSVName = lastQuery.readlines()
        path = 'scrapers/yp/data/' + lastCSVName[0].rstrip()
        return send_file(path,
                mimetype='text/csv',
                attachment_filename=lastCSVName[0].rstrip(),
                as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

