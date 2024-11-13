format_kar:
	go fmt ./...

server:
	go run main.go

run:
	cd frontend && npm start

mongo:
	docker run -d -p 27017:27017 --name mongodb mongo

.PHONY:	format_kar server run mongo

# format_kar, server, and run are marked as .PHONY, meaning make will always run the commands associated with them, even if there are files with those names.
# Without .PHONY, if a file named format_kar exists, make might skip the go fmt ./... command, assuming the target is up to date.