#!/bin/bash
psql postgresql://postgres:example@127.0.0.1 << EOF
       CREATE DATABASE mydb;
EOF
