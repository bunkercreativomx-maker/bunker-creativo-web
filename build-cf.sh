#!/bin/sh
# Arma dist/ para Cloudflare Pages (sin archivos de repo/Vercel)
set -e
rm -rf dist && mkdir dist
for f in *; do case "$f" in dist|functions|README.md|vercel.json|CNAME|build-cf.sh|node_modules) ;; *) cp -r "$f" dist/ ;; esac; done
