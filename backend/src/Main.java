import com.sun.net.httpserver.HttpServer;
import handler.ApiHandler;
import handler.StaticFileHandler;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    public static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Determine frontend directory (check ../frontend, ./frontend, or ./)
            String frontendDir = "frontend";
            File f = new File(frontendDir);
            if (!f.exists() || !f.isDirectory()) {
                f = new File("../frontend");
                if (f.exists() && f.isDirectory()) {
                    frontendDir = "../frontend";
                } else {
                    frontendDir = "."; // fallback to current dir
                }
            }

            // Register API Handler for all /api endpoints
            server.createContext("/api", new ApiHandler());

            // Register Static File Handler for the web frontend
            server.createContext("/", new StaticFileHandler(frontendDir));

            // Use a multi-threaded executor for handling concurrent requests
            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("===============================================================");
            System.out.println("   STUDENT ATTENDANCE MANAGEMENT SYSTEM (CampusCount) - Java  ");
            System.out.println("===============================================================");
            System.out.println("  ✓ Java Server started successfully on port: " + port);
            System.out.println("  ✓ Web Application:   http://localhost:" + port + "/");
            System.out.println("  ✓ API - Student:     http://localhost:" + port + "/api/student");
            System.out.println("  ✓ API - Attendance:  http://localhost:" + port + "/api/attendance");
            System.out.println("  ✓ API - Time Table:  http://localhost:" + port + "/api/timetable");
            System.out.println("  ✓ API - Results:     http://localhost:" + port + "/api/results");
            System.out.println("  ✓ API - Leave:       http://localhost:" + port + "/api/leave");
            System.out.println("  ✓ Static Assets:     " + new File(frontendDir).getAbsolutePath());
            System.out.println("===============================================================");
            System.out.println("Press Ctrl+C to terminate server.");

        } catch (IOException e) {
            System.err.println("Failed to start server on port " + port + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
