#!/usr/bin/python3

"""
LRU Caching
"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """LRU cache class"""

    def __init__(self):
        """Constructor"""
        super().__init__()
        self.keys_list = []

    def put(self, key, item):
        """Add an item in the cache"""
        if key is None or item is None:
            pass
        else:
            if key is not None and item is not None:
                self.cache_data[key] = item
                if key not in self.keys_list:
                    self.keys_list.append(key)
                else:
                    self.keys_list.append(
                        self.keys_list.pop(
                            self.keys_list.index(key)
                        )
                    )
            if len(self.keys_list) > BaseCaching.MAX_ITEMS:
                removed_key = self.keys_list.pop(0)
                del self.cache_data[removed_key]
                print("DISCARD: {}".format(removed_key))

    def get(self, key):
        """Retrieves an item from cache"""
        if key is None or key not in self.cache_data:
            return None

        self.keys_list.remove(key)
        self.keys_list.append(key)
        return self.cache_data[key]
