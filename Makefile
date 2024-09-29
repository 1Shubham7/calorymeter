format_kar:
	go fmt ./...

server:
	go run main.go

.PHONY:	format_kar server