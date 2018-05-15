#!flask/bin/python
import os
from flask import Flask, jsonify, Response
from flask_cors import CORS
import scrapy
from scrapy.crawler import CrawlerRunner
import subprocess

path = os.path.join(os.path.dirname(__file__), 'scrapers/yp')

app = Flask(__name__)
CORS(app)

tasks = [
        {
            'id': 1,
            'title': u'Buy groceries',
            'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
            'done': False
            },
        {
            'id': 2,
            'title': u'Learn Python',
            'description': u'Need to find a good Python tutorial on the web', 
            'done': False
            }
        ]

@app.route('/test')
def index():
    spider_name = "yellowpages"
    subprocess.check_output(['scrapy', 'crawl', spider_name,'-a', 'terms=candles','-a', 'state=ca','-a','city=oakland', '-o', 'output.json'], cwd=path)
    ret = jsonify({'tasks': tasks})
    return ret

if __name__ == '__main__':
    app.run(host='0.0.0.0')
