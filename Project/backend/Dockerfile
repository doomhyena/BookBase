# Backend (PHP + Apache)
FROM php:8.2-apache

# Install mysqli extension
RUN docker-php-ext-install mysqli

# Copy backend files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Enable .htaccess and mod_rewrite
RUN a2enmod rewrite

# Set recommended Apache settings
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

EXPOSE 80
