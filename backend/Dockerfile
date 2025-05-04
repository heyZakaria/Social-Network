FROM golang:1.24

WORKDIR /app

# Copy go.mod and go.sum first
COPY go.mod go.sum ./
RUN go mod download

# Copy the whole backend folder
COPY . .

# Build the Go application
RUN go build -o app ./cmd

# Run the app
CMD ["./app"]
