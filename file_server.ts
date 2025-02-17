import { serve } from "https://deno.land/std@0.223.0/http/server.ts";

const kv = await Deno.openKv(); // KV aç

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/data/")) {
    const filename = url.pathname.substring("/data/".length);

    if (request.method === "GET") {
      const value = await kv.get(["data", filename]);
      return value.value
        ? new Response(JSON.stringify(value.value), { headers: { "Content-Type": "application/json" } })
        : new Response("Not found", { status: 404 });
    }

    if (request.method === "PUT") {
      try {
        const body = await request.json();
        await kv.set(["data", filename], body);
        return new Response("OK");
      } catch (e) {
        return new Response("Error writing data", { status: 500 });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }

  return new Response("404 - Not Found", { status: 404 });
}

serve(handleRequest, { port: 8000 });
