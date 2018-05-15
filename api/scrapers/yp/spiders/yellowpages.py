# -*- coding: utf-8 -*-
import scrapy


class YellowpagesSpider(scrapy.Spider):
    name = 'yellowpages'
    allowed_domains = ['yellowpages.com']

    def __init__(self, terms=None, state=None, city=None):
        super(YellowpagesSpider, self).__init__()
        urls = 'https://www.yellowpages.com/search?search_terms=%s&geo_location_terms=%s %s' % (terms, state, city)
        self.start_urls = [urls]

    def parse(self, response):
        f = open('file.txt','a')
        next_page = response.xpath("//a[@class='next ajax-page']/@href").extract_first()
        f.write(response.body)
        if next_page is not None:
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)
        pass
