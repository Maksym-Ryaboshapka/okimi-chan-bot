FROM mcr.microsoft.com/playwright:v1.55.1-noble

WORKDIR /app

RUN apt-get update && apt-get install -y unzip curl && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash

COPY package*.json bun.lockb* ./

RUN bun install

COPY . .

CMD ["bun", "run", "start"]
