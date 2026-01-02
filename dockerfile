FROM nginx 
WORKDIR /usr/share/nginx/html I 
COPY ./ . 
EXPOSE 80