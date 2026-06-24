import THREE, {GLTFLoader, OrbitControls} from "./three.min.js"

let isRendering = false,
    num = 1;
const renderer = new THREE.WebGLRenderer();
const loader = new GLTFLoader();
//const txloader = new THREE.TextureLoader();
const scene = new THREE.Scene();
let camera;

function disposeNode (node)
{
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshBasicMaterial)
            {
                const mtrl = node.material;
                if (mtrl.map)               mtrl.map.dispose ();
                if (mtrl.lightMap)          mtrl.lightMap.dispose ();
                if (mtrl.aoMap)           mtrl.aoMap.dispose ();
                if (mtrl.normalMap)         mtrl.normalMap.dispose ();
                if (mtrl.specularMap)       mtrl.specularMap.dispose ();
                if (mtrl.envMap)            mtrl.envMap.dispose ();
                if (mtrl.alphaMap)          mtrl.alphaMap.dispose();
                if (mtrl.aoMap)             mtrl.aoMap.dispose();
                if (mtrl.displacementMap)   mtrl.displacementMap.dispose();
                if (mtrl.emissiveMap)       mtrl.emissiveMap.dispose();
                if (mtrl.gradientMap)       mtrl.gradientMap.dispose();
                if (mtrl.metalnessMap)      mtrl.metalnessMap.dispose();
                if (mtrl.roughnessMap)      mtrl.roughnessMap.dispose();

                mtrl.dispose ();    // disposes any programs associated with the material
            }
            else
            {
                if (node.material.map)              node.material.map.dispose ();
                if (node.material.lightMap)         node.material.lightMap.dispose ();
                if (node.material.bumpMap)          node.material.bumpMap.dispose ();
                if (node.material.normalMap)        node.material.normalMap.dispose ();
                if (node.material.specularMap)      node.material.specularMap.dispose ();
                if (node.material.envMap)           node.material.envMap.dispose ();
                if (node.material.alphaMap)         node.material.alphaMap.dispose();
                if (node.material.aoMap)            node.material.aoMap.dispose();
                if (node.material.displacementMap)  node.material.displacementMap.dispose();
                if (node.material.emissiveMap)      node.material.emissiveMap.dispose();
                if (node.material.gradientMap)      node.material.gradientMap.dispose();
                if (node.material.metalnessMap)     node.material.metalnessMap.dispose();
                if (node.material.roughnessMap)     node.material.roughnessMap.dispose();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode

function disposeHierarchy (node, callback)
{
    for (let i = node.children.length - 1; i >= 0; i--)
    {
        const child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
}
////////////////// gaitat (2015), ed. Gaurav Kale (2019). https://stackoverflow.com/a/33199591

const instance_lights = () => {
    let light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(15, 5, 15);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
    let helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    light = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    light.position.set(-8, 1, 2);
    light.target.position.set(10, 0, 10);
    scene.add(light);
    scene.add(light.target);
    helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    const skyColor = 0xB1E1FF;
    const groundColor = 0xB97A20;
    light = new THREE.HemisphereLight(skyColor, groundColor, 0.5);
    scene.add(light);
};

const draw_scene = (url)=>{
    erase_scene();
    document.getElementById('housey').pause();
    document.getElementById('houseysrc').removeAttribute("src");
    document.getElementById('housey').load();
    document.getElementById('housey').pause();
    function render() {
  		renderer.render(scene, camera);
   	}
    if (!isRendering) {
        document.getElementById('housey').style.display = 'none';
       	scene.background = new THREE.Color(0.9, 0.9, 0.9);
       	camera = new THREE.PerspectiveCamera(70, window.innerWidth / (window.innerHeight * 0.8), 0.1, 100);
       	renderer.setSize(window.innerWidth, window.innerHeight * 0.8);

       	document.getElementById("stage").appendChild(renderer.domElement);

        camera.position.set(0, 10, -10);

       	const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 5, 0);
        controls.update();
       	controls.addEventListener('change', render); // remove
       	controls.enableZoom = true;
        isRendering = true;
    }
    loader.load("/ping/" + url, (gltf) => {
        instance_lights();
        scene.add(gltf.scene);
        render();
    }, undefined, (error)=>{
        console.error(error);
    });
};

const erase_scene = ()=>{
    if (!isRendering) return;
    disposeHierarchy (scene, disposeNode);
    scene.clear();
    renderer.dispose();
    renderer.clear();
};

document.getElementById("casa").addEventListener("click", e=>{
    e.preventDefault();
    num = 1;
    draw_scene('house.blend');
});
document.getElementById("cuarto").addEventListener("click", e=>{
    e.preventDefault();
    num = 2;
    draw_scene('waow.blend');
});
document.getElementById("housey").addEventListener("play", e=>{
    e.preventDefault();
    [null,()=>draw_scene('house.blend'),()=>draw_scene('waow.blend')][num]();
});