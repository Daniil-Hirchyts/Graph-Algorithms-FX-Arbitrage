"""Weight calculation utilities."""

import math
from typing import Tuple


class WeightCalculator:
    @staticmethod
    def calculate_effective_value(raw_value: float, total_cost: float) -> float:
        if total_cost >= 10000:
            raise ValueError(
                f"Total cost {total_cost} per-10k units would make value non-positive"
            )
        if raw_value <= 0:
            raise ValueError(f"Raw value must be positive, got {raw_value}")
        return raw_value * (1 - total_cost / 10000)

    @staticmethod
    def calculate_weight_cost(total_cost: float) -> float:
        if total_cost < 0:
            raise ValueError("Total cost must be non-negative")
        return total_cost

    @staticmethod
    def calculate_weight_neglog(effective_value: float) -> float:
        if effective_value <= 0:
            raise ValueError(
                f"Effective value must be positive, got {effective_value}"
            )
        return -math.log(effective_value)

    @staticmethod
    def calculate_all_weights(
        raw_value: float,
        base_cost: float,
        extra_cost: float,
    ) -> Tuple[float, float, float, float]:
        total_cost = base_cost + extra_cost
        effective_value = WeightCalculator.calculate_effective_value(
            raw_value, total_cost
        )
        weight_cost = WeightCalculator.calculate_weight_cost(total_cost)
        weight_neglog = WeightCalculator.calculate_weight_neglog(effective_value)
        return total_cost, effective_value, weight_cost, weight_neglog
