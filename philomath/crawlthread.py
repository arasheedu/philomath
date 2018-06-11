from scrapy.crawler import CrawlerProcess
from philomathspider import PhilomathSpider
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner

def  crawl(url):
    runner = CrawlerRunner()
    d = runner.crawl(PhilomathSpider, start_urls=[url])
    d.addBoth(lambda _: reactor.stop())
    reactor.run(installSignalHandlers=0)