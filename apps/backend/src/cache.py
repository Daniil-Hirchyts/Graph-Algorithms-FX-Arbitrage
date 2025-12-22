"""In-memory graph cache for ephemeral snapshots."""

from collections import OrderedDict
from dataclasses import dataclass
from threading import Lock
from typing import Optional

from .models import GraphPayload


@dataclass(frozen=True)
class CacheEntry:
    graph_payload: GraphPayload
    timestamp: str


class GraphCache:
    def __init__(self, max_size: int = 50):
        self.max_size = max_size
        self._cache: "OrderedDict[str, CacheEntry]" = OrderedDict()
        self._lock = Lock()

    def set(self, key: str, graph_payload: GraphPayload, timestamp: str) -> None:
        with self._lock:
            self._cache[key] = CacheEntry(graph_payload=graph_payload, timestamp=timestamp)
            self._cache.move_to_end(key)
            while len(self._cache) > self.max_size:
                self._cache.popitem(last=False)

    def get(self, key: str) -> Optional[CacheEntry]:
        with self._lock:
            entry = self._cache.get(key)
            if entry:
                self._cache.move_to_end(key)
            return entry

    def latest(self) -> Optional[tuple[str, CacheEntry]]:
        with self._lock:
            if not self._cache:
                return None
            key = next(reversed(self._cache))
            return key, self._cache[key]

    def size(self) -> int:
        with self._lock:
            return len(self._cache)


graph_cache = GraphCache()
