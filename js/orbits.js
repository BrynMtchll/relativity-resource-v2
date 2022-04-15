{   
    let planetNodes = [], orbits = [];
    let timestamp = 0;

    const canvas = $('.orbits-canvas').first()[0];

    canvas.width = canvas.clientWidth;
	canvas.height =  canvas.clientHeight;

    function makeCamera() {
        let fov = 45;
        let aspect = canvas.width / canvas.height;
        let near = 1;
        let far = 10000;
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.set(0, 100, 175);
        return camera;
    }

    let scene = new THREE.Scene();

    {
        let starsImgPath = '../media/stars-5.jpeg';
        let urls = [
          starsImgPath,
          starsImgPath,
          starsImgPath,
          starsImgPath,
          starsImgPath,
          starsImgPath,
        ];
      
        let loader = new THREE.CubeTextureLoader();
        
        let textureCube = loader.load( urls );
        textureCube.format = THREE.RGBFormat;
      
        scene.background = textureCube;
    }

    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor( 0xffffff, 0);

    {
        let loader, texture, material, sun, camera, controls;

        loader = new THREE.TextureLoader();
        texture = loader.load( '../media/sun.jpeg' );
        material = new THREE.MeshPhongMaterial({
            emissive: 'white',
            emissiveMap: texture,
        });

        sun = new THREE.Mesh(new THREE.SphereGeometry(38, 32, 16), material);
        scene.add(sun);

        camera = makeCamera();
        controls = new THREE.OrbitControls(camera, canvas);
        
        planetNodes.push({
            planet: sun,
            camera: camera,
            controls: controls,
            name: 'sun',
        })
    }

    let createPlanet = function(name, radius, orbit, speed) {
        let texture, material, planet, camera, loader, geometry;
        
        
        geometry = new THREE.SphereGeometry(radius, 32, 16);
        loader = new THREE.TextureLoader();
        texture = loader.load( '../media/' + name + '.jpeg' );
        material = new THREE.MeshLambertMaterial({map: texture,});
        
        planet = new THREE.Mesh(geometry, material);
        planet.userData.orbit = orbit;
        planet.userData.speed = speed;
        scene.add(planet);

        camera = makeCamera();
        const controls = new THREE.OrbitControls(camera, canvas);

        planetNodes.push({
            planet: planet,
            camera: camera,
            controls: controls,
            name: name
        })
        
        //orbit
        let shape, spacedPoints, orbitGeom;
        
        shape = new THREE.Shape();
        shape.moveTo(orbit, 0);
        shape.absarc(0, 0, orbit, 0, 2 * Math.PI, false);

        spacedPoints = shape.getSpacedPoints(128);

        orbitGeom = new THREE.BufferGeometry().setFromPoints(spacedPoints); 
        orbitGeom.rotateX(THREE.Math.degToRad(-90));

        orbit = new THREE.Line(orbitGeom, new THREE.LineBasicMaterial({color: "grey"}));
        scene.add(orbit);
        orbits.push(orbit);
    };

    createPlanet("mercury", 1, 46, 5);
    createPlanet("venus", 2, 56, 3);
    createPlanet("earth", 2.5, 65, 4);
    createPlanet("mars", 1.5, 73, 2);
    createPlanet("jupiter", 8, 120, 0.8);
    createPlanet("saturn", 6, 190, 0.5);
    createPlanet("uranus", 4, 300, 0.4);
    createPlanet("neptune", 4, 450, 0.2);

    {
        const ambientLight = new THREE.AmbientLight( 0x404040 );
        scene.add( ambientLight );

        const pointLight = new THREE.PointLight(0xFFFFFF, 2);
        scene.add(pointLight);
    }

    let currentNode = planetNodes[3];

    $('#button-sun').on('click', () => currentNode = planetNodes[0]);
    $('#button-mercury').on('click', () => currentNode = planetNodes[1]);
    $('#button-venus').on('click', () => currentNode = planetNodes[2]);
    $('#button-earth').on('click', () => currentNode = planetNodes[3]);
    $('#button-mars').on('click', () => currentNode = planetNodes[4]);
    $('#button-jupiter').on('click', () => currentNode = planetNodes[5]);
    $('#button-saturn').on('click', () => currentNode = planetNodes[6]);
    $('#button-neptune').on('click', () => currentNode = planetNodes[7]);
    $('#button-uranus').on('click', () => currentNode = planetNodes[8]);

    // $('#button-orbits').on('click', () => {
    orbits.forEach(orbit => orbit.visible = !orbit.visible);
    // })
    // const direction = new THREE.Vector3();
    // const camOffset = 100;

    // planets[3].add(cam);

    function animate() {
        timestamp = Date.now() * 0.0001;

        requestAnimationFrame(animate);

        planetNodes.forEach(function({planet, name}) {
            if (name == 'sun') return;
            planet.position.x = Math.cos(timestamp * planet.userData.speed) * planet.userData.orbit;
            planet.position.z = Math.sin(timestamp * planet.userData.speed) * planet.userData.orbit;
        });

        
        let planet = currentNode.planet, controls = currentNode.controls, camera = currentNode.camera;
        if (currentNode.name != 'sun'){
            const currentObjectPosition = new THREE.Vector3();
            planet.getWorldPosition(currentObjectPosition);
            planet.getWorldPosition(controls.target);
            camera.position.z = currentObjectPosition.z;
            camera.position.x = currentObjectPosition.x;
            controls.update();
        }
        renderer.render(scene, camera);
    }
    animate();
}
