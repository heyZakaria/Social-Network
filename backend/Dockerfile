FROM golang:1.24

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN mkdir -p /app/database

RUN go build -o server ./cmd

CMD ["./server"]
