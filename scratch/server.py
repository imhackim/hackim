import http.server
import socketserver
import os
import mimetypes
import socket

mimetypes.add_type('font/woff2', '.woff2')

PORT = 8080
DIRECTORY = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"
os.chdir(DIRECTORY)

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/ar' or self.path == '/index-ar':
            self.path = '/ar.html'
        elif self.path == '/en' or self.path == '/index':
            self.path = '/index.html'
        elif self.path == '/portfolio':
            self.path = '/portfolio.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

# Support both IPv4 and IPv6
class DualStackServer(socketserver.TCPServer):
    address_family = socket.AF_INET6
    allow_reuse_address = True
    
    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()

try:
    httpd = DualStackServer(("::", PORT), MyHandler)
    print(f"Server on http://localhost:{PORT}/ (dual-stack IPv4+IPv6)", flush=True)
except Exception:
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), MyHandler)
    print(f"Server on http://localhost:{PORT}/ (IPv4)", flush=True)

httpd.serve_forever()
