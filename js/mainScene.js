import * as THREE from './three/three.module.js';


import { OBJLoader  } from './three/OBJLoader.js';
import { GUI } from './three/dat.gui.module.js';

let container, stats;

let camera, scene, renderer;

let pointLight;
let pointLight2;
let pointLight3;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const objects = []

init();
animate();

function init() {

    container = document.getElementById( 'canvas' );
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = - 4000;

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
    const ambient = new THREE.AmbientLight( 0xffffff , 5);
    scene.add( ambient );


    pointLight = new THREE.PointLight( 0xffddff, 9.3 );
    pointLight.position.y = 6000
    pointLight.position.z = -916
    scene.add( pointLight );


    pointLight2 = new THREE.PointLight( 0xffddff, 9.3 );
    pointLight2.position.y = -6000
    pointLight2.position.z = -916
    scene.add( pointLight2 );





    pointLight3 = new THREE.PointLight( 0x009900, 9 );
    pointLight3.position.y = 0
    pointLight3.position.z = -1444
    scene.add( pointLight3 );


    // light representation
    const sphere = new THREE.SphereGeometry( 100, 16, 8 );

    const mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    mesh.scale.set( 0.05, 0.05, 0.05 );
    pointLight.add( mesh );

    // material samples

    const cubeMaterial = new THREE.MeshPhysicalMaterial( {
        color: 0x111111,
        envMap: textureCube,
        refractionRatio: .9,
        reflectivity: 0.5,

            // map: null,
            // metalness: 1,
            // roughness: 1,
            opacity: 1,
            side: THREE.FrontSide,
            transparent: true,
            envMapIntensity: 5,
            premultipliedAlpha: true
    } );

    const cubeMaterial2 = new THREE.MeshPhysicalMaterial( {
        color: 0x555555,
    } );

    // const cubeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } );
    // const cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } );



    const gemBackMaterial = new THREE.MeshPhysicalMaterial( {
        map: null,
        color: 0x111111,
        metalness: 0,
        roughness: .9,
        opacity: 0.9,
        envMap: textureCube,

        refractionRatio: .9,
        reflectivity: 0.5,
        side: THREE.BackSide,
        transparent: true,
        envMapIntensity: 5,
        premultipliedAlpha: true
        // TODO: Add custom blend mode that modulates background color by this materials color.
    } );

    const gemFrontMaterial = new THREE.MeshPhysicalMaterial( {
        map: null,
        color: 0x000000,
        metalness: 0,
        envMap: textureCube,
        roughness: .9,
        opacity: 0.9,
        refractionRatio: .9,
        reflectivity: 0.5,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 1,
        premultipliedAlpha: true
    } );

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
    loader.load( 'models/prism3.obj', function ( object ) {
        // console.log(object)
        //
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material = gemBackMaterial;
                const second = child.clone();
                second.material = gemFrontMaterial;

                const s = 2.5;
                second.scale.x = second.scale.y = second.scale.z = s;
                child.scale.x = child.scale.y = child.scale.z = s;

                child.material.flatShading  = THREE.SmoothShading;
                second.material.flatShading  = THREE.SmoothShading;

                const parent = new THREE.Group();
                parent.add( second );
                parent.add( child );
                scene.add( parent );

                objects.push( parent );
            }

        } );


        // object.traverse(function(child) {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.material.shading = THREE.SmoothShading;
        //         createScene( child, cubeMaterial2 );
        //     }
        // });

        // createScene( object.children[0].geometry, cubeMaterial );

    }, function (e) {
        console.log(e);
    } , function (e) {
        console.log(e);
    } );

    const gui = new GUI();

    const guiLight1 = gui.addFolder('Light 1');
    const guiLight2 = gui.addFolder('Light 2');
    const guiLight3 = gui.addFolder('Light 3');

    const guiMaterialBack = gui.addFolder('Material Back');
    const guiMaterialFront = gui.addFolder('Material Front');

    guiLight1.add(pointLight.position, 'x', -6000, 6000)
    guiLight1.add(pointLight.position, 'y', -6000, 6000)
    guiLight1.add(pointLight.position, 'z', -6000, 6000)
    guiLight1.add(pointLight, 'intensity', 0, 100)

    guiLight2.add(pointLight2.position, 'x', -6000, 6000)
    guiLight2.add(pointLight2.position, 'y', -6000, 6000)
    guiLight2.add(pointLight2.position, 'z', -6000, 6000)
    guiLight2.add(pointLight2, 'intensity', 0, 100)

    guiLight3.add(pointLight3.position, 'x', -6000, 6000)
    guiLight3.add(pointLight3.position, 'y', -6000, 6000)
    guiLight3.add(pointLight3.position, 'z', -6000, 6000)
    guiLight3.add(pointLight3, 'intensity', 0, 100)

    guiMaterialBack.add(gemBackMaterial, 'metalness', 0, 1)
    guiMaterialBack.add(gemBackMaterial, 'roughness', 0, 1)
    guiMaterialBack.add(gemBackMaterial, 'opacity', 0, 1)
    guiMaterialBack.add(gemBackMaterial, 'refractionRatio', 0, 1)
    guiMaterialBack.add(gemBackMaterial, 'reflectivity', 0, 1)


    guiMaterialFront.add(gemFrontMaterial, 'metalness', 0, 1)
    guiMaterialFront.add(gemFrontMaterial, 'roughness', 0, 1)
    guiMaterialFront.add(gemFrontMaterial, 'opacity', 0, 1)
    guiMaterialFront.add(gemFrontMaterial, 'refractionRatio', 0, 1)
    guiMaterialFront.add(gemFrontMaterial, 'reflectivity', 0, 1)


    // guiMaterialBack.addColor( gemBackMaterial, 'color');



    // map: null,
    //     color: 0x000000,
    //     metalness: 0,
    //     envMap: textureCube,
    //     roughness: .9,
    //     opacity: 0.9,
    //     side: THREE.FrontSide,
    //     transparent: true,
    //     envMapIntensity: 1,
    //     premultipliedAlpha: true

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

    const s = 2.5;

    let mesh = new THREE.Mesh( geometry, m1 );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
    mesh.material.flatShading  = THREE.SmoothShading;
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

    // pointLight.position.z = 1200 * Math.cos( timer * 50 );
    // pointLight.position.y = 5200 * Math.sin( timer * 20);


    renderer.render( scene, camera );

}
