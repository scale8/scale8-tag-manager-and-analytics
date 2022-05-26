#!/bin/bash

MICRONAUT_SERVER_PORT=6085 mvn clean install && MICRONAUT_SERVER_PORT=6085 mvn clean package
