#!/usr/bin/python3

from os import path, system
from shutil import move, rmtree
from sys import argv
from tempfile import mkdtemp

BUILD_DIR = 'www'
JS_FILE = 'index.js'
BUILD_JS_PATH = path.join(BUILD_DIR, JS_FILE)

def compile():
	temp_dir = mkdtemp()
	temp_js_path = path.join(temp_dir, JS_FILE)

	if path.isfile(BUILD_JS_PATH):
		move(BUILD_JS_PATH, temp_js_path)

	print('compiling ts')
	result = system('tsc')

	if result == 0:
		print('build succeeded')
		rmtree(temp_dir)
		return
	
	if not path.isfile(temp_js_path):
		print('build failed')
		return

	move(temp_js_path, BUILD_JS_PATH)
	print('build failed restoring js')

def start_server():
	system(f'python3 -m http.server 8069 --directory {BUILD_DIR}')

def main():
	compile()
	if len(argv) > 1 and argv[1] == 'run': start_server()

if __name__ == '__main__': main()
else:
	print('why are you importing this')
	exit()
