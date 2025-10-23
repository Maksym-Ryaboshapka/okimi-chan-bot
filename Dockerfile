FROM oven/bun:1

RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libdrm2 \
    libxkbcommon0 libxcomposite1 libxrandr2 libgbm1 \
    wget gnupg ca-certificates chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json bun.lockb* ./

RUN bun install

RUN bunx playwright install --with-deps chromium

COPY . .

CMD ["bun", "run", "start"]
