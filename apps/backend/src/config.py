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
        # Load YAML config
        config_path = PROJECT_ROOT / "config" / "default.yaml"
        with open(config_path, "r") as f:
            self._config: Dict[str, Any] = yaml.safe_load(f)

        # Override with environment variables where applicable
        self._apply_env_overrides()

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

# Global config instance
config = Config()
