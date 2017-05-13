#!/usr/bin/env bash

function exit_with_error {
	echo "$1" 1>&2
	exit 1
}

cd app
npm install || exit_with_error "Could not install dependencies!"
npm ${@} || exit_with_error "Could not launch npm ${@}!"
