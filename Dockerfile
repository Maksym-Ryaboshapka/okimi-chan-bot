FROM mcr.microsoft.com/playwright:v1.55.1-noble

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash \
  && ln -s /root/.bun/bin/bun /usr/local/bin/bun

COPY package.json bun.lockb* ./

RUN bun install --no-save

COPY . .

CMD ["bun", "run", "start"]
