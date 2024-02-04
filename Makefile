# Makefile to deploy Belize solar information system
# Server using Python Microservice

# Required setup commands:
#sudo mkdir /var/www/html/solar
#sudo chown -R ubuntu:www-data /var/www/html/solar

all: PutHTML

PutHTML:
	cp solar.html /var/www/html/solardemo/
	cp solar.css /var/www/html/solardemo/
	cp solar.js /var/www/html/solardemo/


	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/solar
