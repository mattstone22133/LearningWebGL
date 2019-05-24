
import './three.js';
// import THREE from "./three.js";
// import * as THREE from './three.js'; //error
//import * as Curves from '../extras/curves/Curves.js'; example of how imports work?

//referencing this guys tutorial: https://www.youtube.com/watch?v=YKzyhcyAijo&list=PLRtjMdoYXLf6mvjCmrltvsD0j12ZQDMfE
main();

function main()
{
    var scene = new THREE.Scene();

    const FOV = 75;
    var aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    var camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, wireframe:false} );
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;


    var loader = new THREE.ObjectLoader();
    // var loader = new THREE.ColladaLoader();
    loader.load(
        "./3dBoxMan_FullWeights.dae",
        function(loadedObject){
            scene.add(loadedObject);
        }
    );


    const updateFunc = function() 
    {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.005;
    };

    const renderFunc = function()
    {
        renderer.render(scene, camera);
    };

    var GameLoop = function() 
    {
        requestAnimationFrame( GameLoop );
        updateFunc();
        renderFunc();
    }
    GameLoop();

}