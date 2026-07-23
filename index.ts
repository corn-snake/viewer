import { to_gltf, to_gltf_bin } from "./lib/convert.ts";
import Router from "./lib/router.ts";
import { contentType } from "@std/media-types";

const extname = (str: string) => str.substring(str.lastIndexOf(".") + 1)

const small404 = () => new Response(null, { status: 404 });

const r = new Router()
    .get("/ping/*", async (r) => {
        if (r.url.lastIndexOf("/") + 1 === r.url.length) return small404();
        const last = r.url.substring(r.url.lastIndexOf("/") + 1);
        const stat = await to_gltf(last);
        console.log(r.url)
        if (stat) return new Response(null, { status: 308, headers: { location: "/" + last.substring(0,last.lastIndexOf(".") + 1) + "glb" } })
        return small404();
    })/*
    .post("/pong", async (r) => {
        const o = await to_gltf_bin(r);
        if (!o) return small404();
        const s = new Response(await Deno.readFile(o));
        await Deno.remove(o);
        return s;
    })*/
    .get("/*", async(r)=>{
        const url = new URL(r.url)
        if (url.pathname.endsWith("/")) url.pathname += "index.html";
        const ct = contentType(extname(url.pathname)) ?? (url.pathname.endsWith(".blend") ? "application/x-blender" : "application/octet-stream"),
            cc = url.pathname.endsWith("mp4") || url.pathname.endsWith("blend") || url.pathname.endsWith("glb") ? "max-age=6400" : "no-cache";
        const f = Deno.readFile("./public" + url.pathname).then(t => new Response(t, {headers: {"Content-Type": ct, "CDN-Cache-Control": cc}})).catch(() => small404())
        console.log(url.pathname)
        return await f;
    });

Deno.serve({ hostname: "0.0.0.0", port: 3000 }, r.init());