FROM alpine:3.14.1

RUN apk upgrade --update-cache --available

# Install OpenJDK

RUN apk --no-cache add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

ADD target /opt/target

CMD java -Xmx512m -jar /opt/target/edge-0.1.jar
