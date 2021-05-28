import * as THREE from './three/three.module.js';


import { OBJLoader  } from './three/OBJLoader.js';

let container, stats;

let camera, scene, renderer;

let pointLight;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    container = document.getElementById( 'canvas' );


    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = - 4000;

    //

    const r = "textures/map/";

    const urls = [
        r + "px.jpg", r + "nx.jpg",
        r + "py.jpg", r + "ny.jpg",
        r + "pz.jpg", r + "nz.jpg"
    ];

    const textureCube = new THREE.CubeTextureLoader().load( urls );
    textureCube.mapping = THREE.CubeRefractionMapping;

    scene = new THREE.Scene();
    scene.background = textureCube;

    // LIGHTS

    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    pointLight = new THREE.PointLight( 0xff66ff, 3 );
    pointLight.position.y = 600
    scene.add( pointLight );

    // light representation

    const sphere = new THREE.SphereGeometry( 100, 16, 8 );

    const mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    mesh.scale.set( 0.05, 0.05, 0.05 );
    pointLight.add( mesh );

    // material samples

    const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xccddff, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 } );
    // const cubeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } );
    // const cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } );

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );



    // const loader = new PLYLoader();
    // loader.load( 'models/ply/binary/Lucy100k.ply', function ( geometry ) {
    //
    //     createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 );
    //
    // } );

    const loader = new OBJLoader();
    loader.load( 'models/prism2.obj', function ( obj ) {
        console.log(obj.children[0].geometry)

        createScene( obj.children[0].geometry, cubeMaterial );

    }, function (e) {
        console.log(e);
    } , function (e) {
        console.log(e);
    } );



    document.addEventListener( 'mousemove', onDocumentMouseMove );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function createScene( geometry, m1 ) {

    // geometry.computeVertexNormals();

    const s = 20.5;

    let mesh = new THREE.Mesh( geometry, m1 );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
    scene.add( mesh );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) * .5;
    mouseY = ( event.clientY - windowHalfY ) * .5;

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    const timer = - 0.0002 * Date.now();

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    pointLight.position.x = 2000 * Math.cos( timer * 20 );
    pointLight.position.z = 2000 * Math.sin( timer * 20);


    renderer.render( scene, camera );

}