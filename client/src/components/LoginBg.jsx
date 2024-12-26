import React, { useRef, useEffect } from 'react'

import * as THREE from "three";

import {useTheme} from "@mui/material/styles";

const colors = [0x2FC75A,0xFE4A49,0x9534D5,0x36A0FC,0xFFBB33]
const scene = new THREE.Scene();
var shapes = []

var requestID = null;

function add_shape(_color1,_color2,_size,_x,_y) {

    //var _inner = new THREE.Mesh(new THREE.OctahedronGeometry(_size*0.75,0),new THREE.MeshBasicMaterial({color: bg_color}));
    //var _outer = new THREE.Mesh(new THREE.OctahedronGeometry(_size,0),new THREE.MeshBasicMaterial({color: _color}));
  
    let innerBoxSize = _size*0.75
    var _inner = new THREE.Mesh(new THREE.BoxGeometry(innerBoxSize,innerBoxSize,innerBoxSize),new THREE.MeshBasicMaterial({color: _color2}));
    var _outer = new THREE.Mesh(new THREE.BoxGeometry(_size,_size,_size),new THREE.MeshBasicMaterial({color: _color1}));
  
    _inner.position.set(_x,_y,200)
    _outer.position.set(_x,_y,100)
  
    shapes.push({
      inner : _inner,
      outer : _outer,
      x : _x,
      y : _y,
      screen_x : _x,
      screen_y : _y,
      rotX : randomRelatif(0.02),
      rotY : randomRelatif(0.02),
      rotZ : randomRelatif(0.02),
      update : function() {
  
        this.inner.rotation.x += this.rotX
        this.inner.rotation.y += this.rotY
        this.inner.rotation.z += this.rotZ
  
        this.outer.rotation.x += this.rotX
        this.outer.rotation.y += this.rotY
        this.outer.rotation.z += this.rotZ
  
      }
    })
  
    scene.add(_inner)
    scene.add(_outer)
  
}
  
function placeShapes() {

  shapes.forEach((shape) => {
    // shape.inner.position.set(shape.x*window.innerWidth,shape.y*window.innerHeight,200)
    // shape.outer.position.set(shape.x*window.innerWidth,shape.y*window.innerHeight,100)
    
    shape.inner.position.set(shape.x*window.innerWidth,shape.y*window.innerHeight,200)
    shape.outer.position.set(shape.x*window.innerWidth,shape.y*window.innerHeight,100)

  });
}

function onResize() {
  camera.left = window.innerWidth/2
}

//Retourne nombre pseudo-aléatoire entre -n et n
function randomRelatif(n = 1) {
  return Math.random()*n*2-n
}

const LoginBg = props => {

    const theme = useTheme();
    const canvasRef = useRef(null)

    const draw = ctx => {
        
        scene.background = new THREE.Color( theme.palette.background.default );   
        const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2,window.innerHeight / - 2 ,-1000,1000);

        const renderer = new THREE.WebGLRenderer({
        canvas: ctx.canvas,
        });
        shapes = []

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.position.setZ(150);

        renderer.render(scene,camera);
        
        if (requestID != null) {
          window.cancelAnimationFrame(requestID);
        }

        function animate() {
            requestID = requestAnimationFrame(animate);
            renderer.render(scene,camera);

            shapes.forEach((shape) => shape.update());
        }
        const occShape = 0.5
        
        scene.clear()
        for(let sx = 0;sx<window.innerWidth;sx+=200) {
            for(let sy = 0;sy<innerWidth;sy+=200) {
                if (Math.random()>occShape) {
                    var col = colors[Math.floor(Math.random()*colors.length)];
                    var size = 50+Math.random()*50
                    var x = (sx+randomRelatif(30)-window.innerWidth/2)/window.innerWidth
                    var y = (sy+randomRelatif(30)-window.innerHeight/2)/window.innerHeight
                    add_shape(col,theme.palette.background.paper,size,x,y)
                    //console.log("add shape")
                }
            }
        }

        placeShapes()
        
        animate()
            
    }

    useEffect((props) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('webgl2')
        
        //Our draw come here
        draw(context)
    }, [draw])

    return <canvas id="bg" style = {{position: "fixed",top: 0,left:0,}} ref={canvasRef} {...props}></canvas>

}

export default LoginBg