const text_decoder = new TextDecoder();

const to_gltf = async (s: string) => {
    const stat = await Deno.stat(Deno.cwd() + "/public/" + s.substring(0, s.lastIndexOf(".") + 1) + "glb").then(fi=>fi.isFile).catch(()=>null);
    if (stat) return true;
    const command = new Deno.Command(Deno.cwd() + "/lib/2gltf2/2gltf2.sh", {
        args: [
            "../../public/" + s
        ],
        cwd: Deno.cwd() + "/lib/2gltf2/"
    });
    const { code, stdout, stderr } = await command.output();
    if (code === 0 || code === 139) return true;
    console.log(text_decoder.decode(stderr));
    console.log(text_decoder.decode(stdout));
    return false;
};

const to_gltf_bin = async(r: Request) => {
    const uuid = crypto.randomUUID();
    await Deno.writeFile("./temp/" + uuid + ".blend", await r.bytes());
    const o = await to_gltf("../temp/" + uuid + ".blend");
    await Deno.remove("./temp/" + uuid + ".blend");
    if (!o) return null;
    return "./temp/" + uuid + ".glb";
};

export { to_gltf, to_gltf_bin };