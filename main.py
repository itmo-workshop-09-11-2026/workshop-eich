"""Локальный сервер магазина. python3 main.py [--pack]. Только стандартная библиотека.

Сайт лежит в корне проекта: index.html, styles.css, app.js, assets/.
Сервер и упаковка не публикуют служебные файлы проекта: main.py, README.md,
tests/, plans/, .github/ и прочие.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import tempfile
import urllib.parse
import zipfile

# Папки и файлы проекта, которые не являются частью сайта.
EXCLUDED_DIRS = {'.git', '.github', 'tests', 'plans', 'bin', 'obj', '__pycache__'}
EXCLUDED_FILES = {
    'main.py', 'README.md', 'Dockerfile', 'Makefile', 'shop.zip',
    '.dockerignore', '.codeassistantignore', '.gitignore', '.env',
}


def raise_walk_error(error):
    raise error


def is_excluded_url(url_path):
    """Скрывает служебные файлы проекта от HTTP-запросов."""
    clean = urllib.parse.unquote(url_path.split('?')[0].split('#')[0])
    parts = [part for part in clean.split('/') if part not in ('', '.')]
    if not parts:
        return False
    top = parts[0]
    return top in EXCLUDED_DIRS or top in EXCLUDED_FILES


class PublicHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        if is_excluded_url(self.path):
            self.send_error(404, 'File not found')
            return None
        return super().send_head()


def pack(root='.'):
    # Temporary archive is closed before replacement, including on Windows.
    fd, name = tempfile.mkstemp(prefix='shop-', suffix='.zip', dir='.')
    os.close(fd)
    temporary = Path(name)
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, strict_timestamps=False) as archive:
            for directory, directories, files in os.walk(root, followlinks=False, onerror=raise_walk_error):
                directories[:] = [d for d in directories if d not in EXCLUDED_DIRS]
                for entry in directories + files:
                    path = Path(directory) / entry
                    if path.is_symlink() or path.is_junction():
                        raise ValueError(f'Ссылка в проекте: {path}')
                for entry in files:
                    path = Path(directory) / entry
                    if not path.is_file():
                        raise ValueError(f'Необычный файл: {path}')
                    if path.name in EXCLUDED_FILES:
                        continue
                    # Скрытые файлы не публикуются, кроме .nojekyll для GitHub Pages.
                    if entry.startswith('.') and entry != '.nojekyll':
                        continue
                    archive.write(path, path.relative_to(root).as_posix())
        os.replace(temporary, 'shop.zip')
    finally:
        temporary.unlink(missing_ok=True)
    print('Ready: shop.zip (index.html at archive root)')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pack', action='store_true', help='Упаковать сайт в shop.zip')
    args = parser.parse_args()
    if not Path('index.html').is_file():
        parser.error('Запустите из корня проекта: нет index.html')
    if args.pack:
        pack('.')
        return
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', '8000'))
    handler = partial(PublicHandler, directory='.')
    with ThreadingHTTPServer((host, port), handler) as server:
        print(f'Open http://localhost:{port} - Ctrl+C to stop', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
