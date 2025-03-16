FROM denoland/deno:2.2.4 AS builder

WORKDIR /srv
COPY . .
RUN deno compile -A --frozen --check --output app src/main.ts

CMD ["./app"]

FROM debian:bookworm-slim AS runner

WORKDIR /srv
COPY --from=builder /srv/app .

CMD ["./app"]
