#!/bin/sh
# Arma dist/ para Cloudflare Pages (sin archivos de repo/Vercel)
set -e
rm -rf dist && mkdir dist
for f in *; do case "$f" in dist|functions|README.md|vercel.json|CNAME|build-cf.sh|node_modules) ;; *) cp -r "$f" dist/ ;; esac; done
# 404 real (sin esto Cloudflare Pages devuelve la portada con 200 en rutas inexistentes)
[ -f dist/404.html ] || printf '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada</title></head><body style="font-family:system-ui;text-align:center;padding:4rem 1rem"><h1>404</h1><p>Esta página no existe.</p><p><a href="/">Ir al inicio</a></p></body></html>\n' > dist/404.html
