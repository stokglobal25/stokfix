import http.server
import os
import sys

PORT = 5173
DIR = r'C:\Users\Administrator\stokfix\frontend\dist'

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)
    
    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(DIR)
    server = http.server.HTTPServer(('0.0.0.0', PORT), SPAHandler)
    print(f'Serving StokFix on http://0.0.0.0:{PORT}')
    sys.stdout.flush()
    server.serve_forever()
