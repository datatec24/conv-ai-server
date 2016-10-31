#!/bin/bash

PATH=$PATH:/opt/yarn/bin

if !(which yarn) >/dev/null 2>&1; then
  set -e
  wget -qO- https://yarnpkg.com/latest.tar.gz | tar xz -C /opt/yarn --strip-components=1
  set +e
fi

set -e
yarn
set +e

set -o allexport
source .env
set +o allexport

function wait_for_it {
  until (echo > /dev/tcp/$1/$2) >/dev/null 2>&1; do
    # >&2 echo "$1:$2 is unavailable - sleeping"
    sleep .5
  done
}

wait_for_it $mongo__server__hostname $mongo__server__port
wait_for_it $elasticsearch__server__hostname $elasticsearch__server__port

PATH=$PATH:./node_modules/.bin

exec nodemon ./src/index.js
