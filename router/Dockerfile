FROM alpine:3.14.1

RUN apk upgrade --update-cache --available

RUN apk --no-cache add nginx

ADD nginx.conf /etc/nginx/nginx.conf.template

ADD ui-build /opt/www

RUN apk --no-cache add curl

RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o /opt/envsubst && chmod +x /opt/envsubst

CMD /opt/envsubst '$API_SERVER $EDGE_SERVER $UI_SERVER' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'


