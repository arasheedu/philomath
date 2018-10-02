import datetime
import scrapy
import philomathpipeline

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.selector import HtmlXPathSelector
from philomathitem import PhilomathItem

class PhilomathSpider(scrapy.Spider):
   name = "philomath"
   
   custom_settings = { 'ITEM_PIPELINES' : { 'philomathpipeline.PhilomathPipeline': 300 } }

   def parse(self, response):
       hxs = HtmlXPathSelector(response)
       item = PhilomathItem()
       item['url'] = response.url
       item['title'] = hxs.xpath('//title/text()').extract()
       item['body'] = ' '.join(filter(bool, map(unicode.strip, hxs.xpath('//body//text()').extract())))
       item['date'] = datetime.datetime.now().strftime("%m-%d-%Y %H:%M:%S")
       yield item


