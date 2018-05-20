# -*- coding: utf-8 -*-
import scrapy


class YellowpagesSpider(scrapy.Spider):
    name = 'yellowpages'
    allowed_domains = ['yellowpages.com']

    def __init__(self, terms=None, state=None, city=None):
        super(YellowpagesSpider, self).__init__()
        urls = 'https://www.yellowpages.com/search?search_terms=%s&geo_location_terms=%s %s' % (terms, state, city)
        self.start_urls = [urls]
        fname = "%s-%s-%s.csv" % (state,city,terms)
        self.data = []
        self.output = open(fname,'w')

    def parse(self, response):
        next_page = response.xpath("//a[@class='next ajax-page']/@href").extract_first()
        listings = response.xpath("//div[@class='search-results organic']")
        listings = listings.xpath(".//div[contains(@class,'srp-listing')]")
        for listing in listings:
            name = listing.xpath(".//a[@class='business-name']//text()").extract_first()
            if name == None:
                name = ' '
            website = listing.xpath(".//a[@class='track-visit-website']//@href").extract_first()
            if website == None:
                website = ' '
            address = listing.xpath(".//span[@class='street-address']//text()").extract_first()
            if address == None:
                address = ' '
            phone = listing.xpath(".//div[@class='phones phone primary']//text()").extract_first()
            if phone == None:
                phone = ' '
            self.output.write("%s,%s,%s,%s" % (name, address, phone, website))
            self.output.write("\n")


        # self.output.write(str(addresses))
        # self.output.write(str(websites))
        # self.output.write(str(phones))
        if next_page is not None:
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)
        pass
