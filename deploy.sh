#!/bin/bash
git pull
npm install
npm run-script build
rm -rf live
mv build live
