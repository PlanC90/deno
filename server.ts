import { serve } from "https://deno.land/std@0.223.0/http/server.ts";

const REMOTE_DATA_URL = "https://memex.planc.space/data/";

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/data/")) {
    const filename = url.pathname.substring("/data/".length);
    const remoteFileURL = REMOTE_DATA_URL + filename;

    if (request.method === "GET") {
      try {
        const response = await fetch(remoteFileURL);
        if (!response.ok) {
          return new Response("Not found", { status: 404 });
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        console.error("Error fetching data:", e);
        return new Response("Error fetching data", { status: 500 });
      }
    }

    if (request.method === "PUT") {
      try {
        const body = await request.text(); // Get raw text body
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Required for CORS
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        };

        const response = await fetch(remoteFileURL, {
          method: "PUT",
          headers: headers,
          body: body,
        });

        if (!response.ok) {
          console.error("Error writing data:", response.status, response.statusText);
          return new Response(`Error writing data: ${response.statusText}`, { status: 500 });
        }

        return new Response("OK", { headers: headers });
      } catch (e) {
        console.error("Error writing data:", e);
        return new Response("Error writing data", { status: 500 });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }

  return new Response("404 - Not Found", { status: 404 });
}

serve(handleRequest, { port: 8000 });
