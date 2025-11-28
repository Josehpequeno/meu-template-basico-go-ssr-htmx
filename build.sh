go mod tidy
go build -o app-exemplo
sudo mv app-exemplo /usr/local/bin/
sudo systemctl restart app-app-exemplo.service

