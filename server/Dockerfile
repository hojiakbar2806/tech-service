FROM python:3.12-slim AS base

RUN apt-get -y update && \
    apt-get install -yq openssl git ca-certificates tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock* /app/
RUN poetry config virtualenvs.create false && poetry install --no-root

COPY . .

EXPOSE 8000

CMD ["gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 app.main:app"]