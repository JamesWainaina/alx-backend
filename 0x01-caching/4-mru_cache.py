#!/usr/bin/python3
""" MRU Caching """

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    MRU Caching system that inherits from BasicCache
    """

    def __init__(self):
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """Adding item to the cache"""
        if key is not None and item is not None:
            self.cache_data[key] = item
            if key not in self.queue:
                self.queue.append(key)
            else:
                self.queue.append(
                    self.queue.pop(self.queue.index(key)))

            if len(self.queue) > BaseCaching.MAX_ITEMS:
                removed_key = self.queue.pop(-2)
                del self.cache_data[removed_key]
                print("DISCARD: {}".format(removed_key))

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        self.queue.append(self.queue.pop(self.queue.index(key)))
        return self.cache_data(key)
