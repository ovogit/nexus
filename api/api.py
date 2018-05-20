#!flask/bin/python
import os
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import scrapy
from scrapy.crawler import CrawlerRunner
import subprocess

path = os.path.join(os.path.dirname(__file__), 'scrapers/yp')

app = Flask(__name__)
CORS(app)


@app.route('/ypscraper/<state>/<city>/<terms>')
def index(state, city, terms):
    spider_name = "yellowpages"
    city = "city=%s" % city
    state = "state=%s" % state
    terms = "terms=%s" % terms
    subprocess.check_output(['scrapy', 'crawl', spider_name,'-a', city ,'-a', state,'-a',terms, '-o', 'output.json'], cwd=path)
    ret = jsonify({'data': 'true' })
    return ret
# TODO Process the scraped pages, and parse the data then send to json response

if __name__ == '__main__':
    app.run(host='0.0.0.0')
