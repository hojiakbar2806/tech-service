import logging
import sys


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("logging.log", mode="a", encoding="utf-8"),
        ],
    )


setup_logging()

logger = logging.getLogger("app")
