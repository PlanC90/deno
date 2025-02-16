import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
  import { readJson, writeJson } from "https://deno.land/x/jsonfile@v1.0.0/mod.ts";

  const dataDir = './data'; // Local directory to store JSON files

  async function handleRequest(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Serve static files from the public directory
    if (pathname.startsWith("/data/")) {
      try {
        const filename = pathname.substring("/data/".length);
        const filePath = `${dataDir}/${filename}`;

        if (request.method === "GET") {
          try {
            const jsonData = await readJson(filePath);
            return new Response(JSON.stringify(jsonData, null, 2), {
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            console.error(`Error reading ${filename}:`, error);
            return new Response("Not Found", { status: 404 });
          }
        } else if (request.method === "PUT") {
          try {
            const body = await request.text();
            const jsonData = JSON.parse(body);
            await writeJson(filePath, jsonData, { spaces: 2 });
            return new Response(JSON.stringify({ message: "Data updated successfully" }), {
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            console.error(`Error writing to ${filename}:`, error);
            return new Response("Internal Server Error", { status: 500 });
          }
        } else {
          return new Response("Method Not Allowed", { status: 405 });
        }
      } catch (error) {
        console.error("Error serving static file:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  console.log("Server listening on port 8000");
  serve(handleRequest, { port: 8000 });
