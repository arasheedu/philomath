import falcon
import scrapy
import settings
import logging
import threading
import subprocess
import crawlthread
import urllib2

from multiprocessing import Process, Queue
from elasticsearch import Elasticsearch, helpers
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from twisted.internet import reactor
from scrapy.crawler import CrawlerProcess

from philomathspider import PhilomathSpider

es = Elasticsearch(hosts = [settings.SEARCH_HOST])

class Philomath:
    def on_post(self, req, resp):
        if not es.indices.exists(settings.INDEX_NAME):
            es_request_body = {
                "settings" : {
                    "number_of_shards": 1,
                    "number_of_replicas": 0
                }
           
            }
            es_response = es.indices.create(index = settings.INDEX_NAME, body = es_request_body)
        configure_logging()
        url = req.stream.read().decode('utf-8')
        decodedurl = urllib2.unquote(url).decode('utf8')
        already_indexed = es.exists(index=settings.INDEX_NAME,doc_type='philomathitem',id=decodedurl)
        if not already_indexed:
            logging.warning('not indexed')
            crawlerProcess=Process(target=crawlthread.crawl, kwargs={"url" : decodedurl})
            crawlerProcess.start()
            crawlerProcess.join()
        else:
            logging.warning('already indexed')
        resp.status = falcon.HTTP_200

api = falcon.API()
api.add_route('/url', Philomath())