#!/usr/bin/python3

"""
Use FIFO caching
"""

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """FIFO cache class"""

    def __init__(self):
        """Constructor"""
        super().__init__()

    def put(self, key, item):
        """Add an item in the cache"""
        if key is not None and item is not None:
            if len(self.cache_data) >= self.MAX_ITEMS:
                first = list(self.cache_data.keys())[0]
                print("DISCARD: {}".format(first))
                self.cache_data.pop(first)
            self.cache_data[key] = item

    def get(self, key):
        """getting the items of cache"""
        if key is not None or key not in self.cache_data:
            return self.cache_data[key]
