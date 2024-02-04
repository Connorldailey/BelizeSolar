# Makefile to deploy Belize solar information system
# Server using Python Microservice

# Required setup commands:
#sudo mkdir /var/www/html/BelizeSolar
#sudo chown -R ubuntu:www-data /var/www/html/BelizeSolar

all: PutHTML

PutHTML:
	cp solar.html /var/www/html/BelizeSolar/
	cp solar.css /var/www/html/BelizeSolar/
	cp solar.js /var/www/html/BelizeSolar/


	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/BelizeSolar
