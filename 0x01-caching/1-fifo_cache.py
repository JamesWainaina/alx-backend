#!/usr/bin/python3

"""
Use FIFO caching
"""

from base_caching import BaseCaching
from collections import deque

class FIFOCache(BaseCaching):
    """FIFO cache class"""

    def __init__(self):
        """Constructor"""
        super().__init__()
        self.queue = deque()

    def put(self, key, item):
        """Add an item in the cache"""
        if key and item:
            self.cache_data[key] = item
            self.queue.append(key)

            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                oldest_key = self.queue.popleft()
                self.cache_data.pop(oldest_key)
                print("DISCARD: {}".format(oldest_key))

    def get(self, key):
        """getting the items of cache"""
        if key is not None or key not in self.cache_data:
            return self.cache_data[key]
