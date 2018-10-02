import scrapy
import settings
import logging

from elasticsearch import Elasticsearch, helpers

es = Elasticsearch(hosts = [settings.SEARCH_HOST])

class PhilomathPipeline(object):     
    def process_item(self, item, spider):
        item_to_index = {
            '_id': item['url'],
            '_index': settings.INDEX_NAME,
            '_type': settings.TYPE_NAME,
            '_source': dict(item)
        }
        items = []
        items.append(item_to_index)
        helpers.bulk(es, items)
        return item



