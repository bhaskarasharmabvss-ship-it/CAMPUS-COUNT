package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class StaticFileHandler implements HttpHandler {
    private final String baseDir;
    private static final Map<String, String> MIME_TYPES = new HashMap<>();

    static {
        MIME_TYPES.put(".html", "text/html; charset=UTF-8");
        MIME_TYPES.put(".htm", "text/html; charset=UTF-8");
        MIME_TYPES.put(".css", "text/css; charset=UTF-8");
        MIME_TYPES.put(".js", "application/javascript; charset=UTF-8");
        MIME_TYPES.put(".json", "application/json; charset=UTF-8");
        MIME_TYPES.put(".png", "image/png");
        MIME_TYPES.put(".jpg", "image/jpeg");
        MIME_TYPES.put(".jpeg", "image/jpeg");
        MIME_TYPES.put(".svg", "image/svg+xml");
        MIME_TYPES.put(".ico", "image/x-icon");
        MIME_TYPES.put(".woff2", "font/woff2");
        MIME_TYPES.put(".woff", "font/woff");
        MIME_TYPES.put(".ttf", "font/ttf");
    }

    public StaticFileHandler(String baseDir) {
        this.baseDir = baseDir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        URI uri = exchange.getRequestURI();
        String path = uri.getPath();

        // Default route to index.html
        if (path.equals("/") || path.isEmpty()) {
            path = "/index.html";
        }

        String relPath = path.startsWith("/") ? path.substring(1) : path;
        Path filePath = Paths.get(baseDir, relPath.replace('/', File.separatorChar)).normalize();

        // Security check: ensure path is within baseDir
        Path basePath = Paths.get(baseDir).toAbsolutePath().normalize();
        Path absoluteFilePath = filePath.toAbsolutePath().normalize();
        if (!absoluteFilePath.startsWith(basePath) || !Files.exists(absoluteFilePath) || Files.isDirectory(absoluteFilePath)) {
            String response = "<h1>404 Not Found</h1><p>The requested file was not found.</p>";
            byte[] errBytes = response.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
            exchange.sendResponseHeaders(404, errBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(errBytes);
            os.close();
            return;
        }

        String mimeType = getMimeType(path);
        exchange.getResponseHeaders().set("Content-Type", mimeType);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

        byte[] fileBytes = Files.readAllBytes(absoluteFilePath);
        exchange.sendResponseHeaders(200, fileBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(fileBytes);
        os.close();
    }

    private String getMimeType(String path) {
        int dotIndex = path.lastIndexOf('.');
        if (dotIndex != -1) {
            String ext = path.substring(dotIndex).toLowerCase();
            return MIME_TYPES.getOrDefault(ext, "application/octet-stream");
        }
        return "application/octet-stream";
    }
}
