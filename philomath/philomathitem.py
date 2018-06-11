import scrapy

class PhilomathItem(scrapy.Item):
   url = scrapy.Field()
   title = scrapy.Field()
   body = scrapy.Field()
   date = scrapy.Field()
