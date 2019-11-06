FROM node:latest
RUN apt-get update  && apt-get install -y nginx
WORKDIR /usr/src/app
COPY . .
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log
EXPOSE 3003
RUN cp -r dist/* /var/www/html \
    && rm -rf /user/src/app
CMD ["nginx","-g","daemon off;"]
