FROM golang:1.24-alpine

WORKDIR /app

COPY . .
ENV CGO_ENABLED=1
RUN apk add --no-cache gcc musl-dev sqlite-dev

RUN go build -o main ./cmd

CMD ["./main"]
z