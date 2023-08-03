FROM nginx
COPY nginx_conf/spa.conf /etc/nginx/conf.d/default.conf
COPY dist/myex /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
