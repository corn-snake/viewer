var isRendering = false,
    num = 1;
var renderer = new THREE.WebGLRenderer();
var loader = new THREE.GLTFLoader();
//var txloader = new THREE.TextureLoader();
var scene = new THREE.Scene();
var camera;

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
                var mtrl = node.material;
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
    for (var i = node.children.length - 1; i >= 0; i--)
    {
        var child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
}
////////////////// gaitat (2015), ed. Gaurav Kale (2019). https://stackoverflow.com/a/33199591

function instance_lights(){
    var light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(15, 5, 15);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
    var helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    light = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    light.position.set(-8, 1, 2);
    light.target.position.set(10, 0, 10);
    scene.add(light);
    scene.add(light.target);
    helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    var skyColor = 0xB1E1FF;
    var groundColor = 0xB97A20;
    light = new THREE.HemisphereLight(skyColor, groundColor, 0.5);
    scene.add(light);
};

function draw_scene (url){
    erase_scene();
    /*document.getElementById('housey').pause();
    document.getElementById('houseysrc').removeAttribute("src");
    document.getElementById('housey').load();
    document.getElementById('housey').pause();*/
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

       	var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enablePan = true;
        controls.screenSpacePanning = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.minDistance = 2;
        controls.maxDistance = 90;
        controls.target.set(0, 5, 0);
        controls.update();
       	controls.addEventListener('change', render); // remove
       	controls.enableZoom = true;
        isRendering = true;
    }
    loader.load("/ping/" + url, function(gltf){
        instance_lights();
        scene.add(gltf.scene);
        render();
    }, undefined, function(error){
        console.error(error);
    });
};

function erase_scene (){
    if (!isRendering) return;
    disposeHierarchy (scene, disposeNode);
    scene.clear();
    renderer.dispose();
    renderer.clear();
};


function housify(){
    //e.preventDefault();
    num = 1;
    console.log('house!');
    draw_scene('house.blend');
    /*document.getElementById('houseysrc').setAttribute('src', '/house.mp4');
    document.getElementById('housey').load();*/
}
function roomify(){
    //e.preventDefault();
    num = 2;
    console.log('room!');
    draw_scene('waow.blend');
    /*document.getElementById('houseysrc').setAttribute('src', '/room.mp4');
    document.getElementById('housey').load();*/
}
function play_handle(){
    [null,()=>draw_scene('house.blend'),()=>draw_scene('waow.blend')][num]();
}

var keyboardMoveEnabled = true;
var mouseLookEnabled = true;
var isPointerLocked = false;
var yaw = 0;
var pitch = 0;
var mouseSensitivity = 0.0022;
var pressed = {};
var clock = new THREE.Clock();

function syncMouseLookFromCamera() {
  var euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
  pitch = euler.x;
  yaw = euler.y;
}
function enterMouseLook() {
  if (!mouseLookEnabled) return;
  syncMouseLookFromCamera();
  if (canvas.requestPointerLock) canvas.requestPointerLock();
}
function updatePointerLockState() {
  isPointerLocked = document.pointerLockElement === canvas;
  controls.enabled = !isPointerLocked;
  if (mouseLookBtn) mouseLookBtn.textContent = isPointerLocked ? 'Mirada mouse: Activa' : 'Mirada mouse: Clic';
  if (!isPointerLocked) syncMouseLookFromCamera();
}
document.addEventListener('pointerlockchange', updatePointerLockState);
document.addEventListener('mousemove', function(e) {
  if (!isPointerLocked || !mouseLookEnabled) return;
  yaw -= e.movementX * mouseSensitivity;
  pitch -= e.movementY * mouseSensitivity;
  var limit = Math.PI / 2 - 0.06;
  pitch = Math.max(-limit, Math.min(limit, pitch));
  camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
  var forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  controls.target.copy(camera.position).add(forward.multiplyScalar(5));
});
canvas.addEventListener('click', enterMouseLook);

document.addEventListener("DOMContentLoaded", housify);