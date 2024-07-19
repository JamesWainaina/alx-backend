#!/usr/bin/python3


"""
LIFO cache
"""

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFO cache class"""

    def __init__(self):
        """Constructor"""
        super().__init__()

    def put(self, key, item):
        """Add an item to cache"""
        if key is None or item is None:
            pass
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS \
                    and key not in self.cache_data:
                latest_key, latest_item = self.cache_data.popitem()
                print("DISCARD: {}".format(latest_key))
            self.cache_data[key] = item

    def get(self, key):
        """Get the item by key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
        return None
