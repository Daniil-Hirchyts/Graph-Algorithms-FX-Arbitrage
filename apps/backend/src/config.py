"""Configuration management."""

import os
from pathlib import Path
from typing import Any, Dict, List

import yaml
from dotenv import load_dotenv

# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Load environment variables from backend root
load_dotenv(PROJECT_ROOT / ".env")


class Config:
    """Application configuration."""

    def __init__(self):
        """Load configuration from YAML and environment variables."""
        # Load YAML config with fallback to defaults
        config_path = PROJECT_ROOT / "config" / "default.yaml"

        try:
            with open(config_path, "r") as f:
                self._config: Dict[str, Any] = yaml.safe_load(f)
        except (FileNotFoundError, IOError) as e:
            # Fallback to hardcoded defaults for serverless environments
            print(f"Warning: Could not load config file, using defaults: {e}")
            self._config = self._get_default_config()

        # Override with environment variables where applicable
        self._apply_env_overrides()

    def _get_default_config(self) -> Dict[str, Any]:
        """Return default configuration when YAML file is not available."""
        return {
            "nodes": {
                "default_list": ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD", "SEK", "NOK"],
                "anchor_node": "USD"
            },
            "cost_model": {
                "base_cost": 10,
                "extra_cost": 5
            },
            "generated_data": {
                "default_num_nodes": 7,
                "default_value_min": 0.1,
                "default_value_max": 10.0,
                "default_variance": "medium",
                "available_nodes": [
                    "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD", "SEK", "NOK",
                    "SGD", "HKD", "MXN", "BRL", "INR", "CNY", "KRW", "ZAR", "PLN", "CZK",
                    "TRY", "AED", "SAR", "THB", "MYR", "IDR", "PHP"
                ]
            }
        }

    def _apply_env_overrides(self):
        """Apply environment variable overrides."""
        # API settings
        self.api_host = os.getenv("API_HOST", "0.0.0.0")
        self.api_port = int(os.getenv("API_PORT", "8000"))

    @property
    def nodes(self) -> List[str]:
        return self._config["nodes"]["default_list"]

    @property
    def anchor_node(self) -> str:
        return self._config["nodes"]["anchor_node"]

    @property
    def base_cost(self) -> float:
        return float(self._config["cost_model"]["base_cost"])

    @property
    def extra_cost(self) -> float:
        return float(self._config["cost_model"]["extra_cost"])

    @property
    def total_cost(self) -> float:
        return self.base_cost + self.extra_cost

    @property
    def available_nodes(self) -> List[str]:
        return self._config["generated_data"]["available_nodes"]

    @property
    def default_num_nodes(self) -> int:
        return int(self._config["generated_data"]["default_num_nodes"])

    @property
    def default_value_min(self) -> float:
        return float(self._config["generated_data"]["default_value_min"])

    @property
    def default_value_max(self) -> float:
        return float(self._config["generated_data"]["default_value_max"])

    @property
    def default_variance(self) -> str:
        return str(self._config["generated_data"]["default_variance"])

# Global config instance
config = Config()
