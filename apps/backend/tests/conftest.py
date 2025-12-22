"""Pytest fixtures and configuration."""

from typing import Dict

import pytest


@pytest.fixture
def sample_node_values() -> Dict[str, float]:
    return {
        "A": 1.0,
        "B": 0.92,
        "C": 0.79,
        "D": 1.48,
        "E": 0.88,
        "F": 1.35,
        "G": 1.52,
        "H": 1.65,
        "I": 1.34,
        "J": 1.82,
    }


@pytest.fixture
def sample_nodes() -> list:
    return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]


@pytest.fixture
def sample_pairs() -> list:
    return [
        ("A", "B"),
        ("B", "A"),
        ("A", "C"),
        ("C", "A"),
        ("B", "C"),
        ("C", "B"),
        ("A", "D"),
        ("D", "A"),
    ]

