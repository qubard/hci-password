var scene = new THREE.Scene();
scene.background = new THREE.Color(0xC48BA0);

var aspect = window.innerWidth / window.innerHeight;

var size = 50;

var camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.01, 11000);

var renderer = new THREE.WebGLRenderer({
	antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

var cube_geometry = new THREE.BoxGeometry(size, size, size);

var EDIT_MODE = true;

var cubes = [];

var username = '';

function generateUser() {
	username = "3DPass" + Math.floor(Math.random() * 100000);
};

generateUser();

$("#username").html(username);

var infoBox = $('#info-inner');

var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(100, 100, 100);
light.lookAt(200, 40, 140);

scene.add(light);

var light2 = new THREE.DirectionalLight(0xFFFFFF, 0.8);
light2.position.set(-50, 250, -100);
light2.lookAt(50, 50, 50);

scene.add(light2);

var light3 = new THREE.DirectionalLight(0xFFFFF, 1);
light3.position.set(300, 250, 300);
light3.lookAt(50, 50, 50);

scene.add(light3);

var loader = new THREE.JSONLoader();

function onWindowResize(event) {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);

var static_positions = [{
	x: 1,
	z: 1
}, {
	x: 1,
	z: 7
}, {
	x: 1,
	z: 17
}, {
	x: 7,
	z: 1
}, {
	x: 7,
	z: 7
}, {
	x: 7,
	z: 17
}, {
	x: 17,
	z: 1
}, {
	x: 17,
	z: 7
}, {
	x: 17,
	z: 17
}];

var carleton_models = [{
	label: 'podium',
	scale: 1,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'laptop',
	scale: 0.5,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'chair',
	scale: 2,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'bookshelf',
	scale: 0.5,
	ty: 120,
	roty: 0
}, {
	label: 'blackboard',
	scale: 0.6,
	ty: 40,
	roty: 0
}, {
	label: 'table',
	scale: 0.8,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'book',
	scale: 0.2,
	ty: 40,
	roty: Math.PI / 2
}, {
	label: 'earth',
	scale: 1,
	ty: 80,
	roty: Math.PI / 2
}];

var travel_models = [{
	label: 'camera',
	scale: 0.9,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'map',
	scale: 1.5,
	ty: 80,
	roty: 0
}, {
	label: 'bottle',
	scale: 1.3,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'binoculars',
	scale: 0.6,
	ty: 60,
	roty: 0
}, {
	label: 'sunglasses',
	scale: 1.2,
	ty: 40,
	roty: 0
}, {
	label: 'suitcase',
	scale: 1.2,
	ty: 80,
	roty: Math.PI / 2
}, {
	label: 'stopsign',
	scale: 1.4,
	ty: 40,
	roty: Math.PI / 2
}, {
	label: 'plane',
	scale: 2,
	ty: 30,
	roty: Math.PI / 2
}];

var store_models = [{
	label: 'shopping_bag',
	scale: 2,
	ty: 30,
	roty: Math.PI / 2
}, {
	label: 'shopping_cart',
	scale: 1,
	ty: 60,
	roty: 0
}, {
	label: 'sale',
	scale: 1.3,
	ty: 60,
	roty: Math.PI / 4
}, {
	label: 'cctv',
	scale: 0.8,
	ty: 60,
	roty: 0
}, {
	label: 'carton',
	scale: 0.8,
	ty: 40,
	roty: 0
}, {
	label: 'box',
	scale: 0.9,
	ty: 80,
	roty: Math.PI / 2
}, {
	label: 'boot',
	scale: 1.4,
	ty: 40,
	roty: Math.PI / 2
}, {
	label: 'banana',
	scale: 0.5,
	ty: 40,
	roty: Math.PI / 2
}];

var i = 0;

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function initHeightmap(mapSize) {
	var heightMap = new Array(mapSize);
	for (var i = 0; i < mapSize; i++) {
		heightMap[i] = new Array(mapSize);
		for (var j = 0; j < heightMap[i].length; j++) {
			heightMap[i][j] = 0;
		}
	}
	return heightMap;
}

var n_tiles = 20;
var heightMap = initHeightmap(n_tiles);

var orders = [0, 1, 2];

orders = shuffle(orders);
var final_passwords = [];

if (EDIT_MODE) {
	for (var x = 0; x < heightMap[0].length; x++) {
		for (var z = 0; z < heightMap[x].length; z++) {
			addCube(x * size, heightMap[x][z], z * size, 0xFFFFFF);
		}
	}
}

var ind = 0; // we're doing asynchronous stuff so this is needed, very bad
var ind2 = 0;
var ind3 = 0;

var objects = []; // the 8 objects for each password
var c_mesh = [];
var t_mesh = [];
var s_mesh = [];

// The way mesh is loaded could be improved

carleton_models.forEach(model => {
	loader.load(
		// resource URL
		'models/carleton/' + model.label + '.json',

		// onLoad callback
		function(geometry, materials) {
			mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
			mesh.label = model.label;
			mesh.scale.set(size * model.scale, size * model.scale, size * model.scale);
			var box = new THREE.Box3().setFromObject(mesh);
			console.log("Loading " + model.label);
			console.log(model.label, Math.abs(box.max.y - box.min.y), box.min, box.max, box.size());
			var x = static_positions[ind].x;
			var z = static_positions[ind].z;
			mesh.position.set(x * size, heightMap[x][z] + model.ty, z * size);
			ind++;
			mesh.rotation.y = model.roty;
			mesh.initroty = mesh.rotation.y;
			mesh.ty = model.ty;
			model.mesh = mesh;
			c_mesh.push(mesh);
			objects.push(mesh);
			scene.add(mesh);
		},

		// onProgress callback
		function(xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},

		// onError callback
		function(err) {
			console.log('An error happened');
		}
	);
});

travel_models.forEach(model => {
	loader.load(
		// resource URL
		'models/travel/' + model.label + '.json',

		// onLoad callback
		function(geometry, materials) {
			mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
			mesh.label = model.label;
			mesh.scale.set(size * model.scale, size * model.scale, size * model.scale);
			var box = new THREE.Box3().setFromObject(mesh);
			console.log("Loading " + model.label);
			console.log(model.label, Math.abs(box.max.y - box.min.y), box.min, box.max, box.size());
			var x = static_positions[ind2].x;
			var z = static_positions[ind2].z;
			mesh.position.set(x * size, heightMap[x][z] + model.ty, z * size);
			ind2++;
			mesh.rotation.y = model.roty;
			mesh.ty = model.ty;
			mesh.initroty = mesh.rotation.y;
			model.mesh = mesh;
			t_mesh.push(mesh);
		},

		// onProgress callback
		function(xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},

		// onError callback
		function(err) {
			console.log('An error happened');
		}
	);
});

store_models.forEach(model => {
	loader.load(
		// resource URL
		'models/store/' + model.label + '.json',

		// onLoad callback
		function(geometry, materials) {
			mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
			mesh.label = model.label;
			mesh.scale.set(size * model.scale, size * model.scale, size * model.scale);
			var box = new THREE.Box3().setFromObject(mesh);
			console.log("Loading " + model.label);
			console.log(model.label, Math.abs(box.max.y - box.min.y), box.min, box.max, box.size());
			var x = static_positions[ind2].x;
			var z = static_positions[ind2].z;
			mesh.position.set(x * size, heightMap[x][z] + model.ty, z * size);
			ind3++;
			mesh.rotation.y = model.roty;
			mesh.initroty = mesh.rotation.y;
			mesh.ty = model.ty;
			model.mesh = mesh;
			s_mesh.push(mesh);
		},

		// onProgress callback
		function(xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},

		// onError callback
		function(err) {
			console.log('An error happened');
		}
	);
});


function addCube(x, y, z, col) {
	let material = new THREE.MeshPhongMaterial({
		color: col
	});
	let cube = new THREE.Mesh(cube_geometry, material);
	cube.position.set(x, y, z);
	cube.isCube = true;
	cubes.push(cube);
	scene.add(cube);
}

document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var k = 0.0;

camera.position.set(900, 900, 900);
camera.lookAt(0, 0, 0);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {
	// update vector's positions
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

var startTime = 0;

function onMouseDown(event) {
	if (selected == null) {
		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(scene.children);

		for (var i in intersects) {
			var intersect = intersects[i];
			if (intersect && intersect.object != undefined && !intersect.object.isCube) {
				//doWithSelected(intersect, event.button);
				selected = intersect.object;
				startTime = new Date();
				break;
			}
		}
	}
}

Array.prototype.removeEle = function(ele) {
	var index = this.indexOf(ele);
	if (index >= 0) {
		this.splice(index, 1);
		return true;
	}
	return false;
}

function removeCube(x, y, z) {
	cubes.forEach(cube => {
		if (cube.position.x == x && cube.position.y == y && cube.position.z == z) {
			scene.remove(cube);
			cubes.removeEle(cube);
			return;
		}
	});
}

function doWithSelected(selected, button) {
	// add a cube on top of selected
	position = selected.object.position;
	if (!button) {
		addCube(position.x + selected.face.normal.x * size, position.y + selected.face.normal.y * size, position.z + selected.face.normal.z * size, 0xEDEDED);
	} else {
		removeCube(position.x, position.y, position.z);
	}
}

var selected;

var valid_passwords = [];

function generate_valid_passwords(arr) {
	a_password = [];
	for (var i = 0; i < arr.length; i++) {
		let ind = Math.floor(Math.random() * arr.length);
		a_password.push(arr[ind].label);
	}
	return a_password;
}

valid_passwords['Carleton'] = generate_valid_passwords(carleton_models);
valid_passwords['Travel'] = generate_valid_passwords(travel_models);
valid_passwords['Store'] = generate_valid_passwords(store_models);

var password = [];

function resetPassword() {
	password = [];
}

var n_attempts = 1;

var submitOnce = true;

function submitLog() {
	if (submitOnce) {
		$.ajax({
			url: 'https://upload.blueberrypancak.es/private/password-demo/save.php',
			data: {
				log: logdata
			},
			success: function(ret) {
				alert(ret);
				logdata = "";
			}
		});
		submitOnce = false;
	}
}

function failInfo() {
	return valid_password ? '<b style="color:#00FF00">Correct password!</b></br>' : (failFlag ? '<b style="color:red">Bad password.' + (!badFail ? 'Try again.' : '') + '</b></br>' : '');
}

var step = 0;

function resetObjects() {
	static_positions = shuffle(static_positions);
	if (selected) {
		for (var i = 0; i < selected.material.length; i++) {
			selected.material[i].opacity = 1;
		}
	}

	for (var i = 0; i < objects.length; i++) {
		var object = objects[i];
		var x = static_positions[i].x;
		var z = static_positions[i].z;
		object.rotation.y = object.initroty;
		object.position.set(x * size, heightMap[x][z] + object.ty, z * size);
	}
}

var logdata = "";

function formatDate() {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-') + " " + [(d.getHours() < 10 ? "0" : "") + d.getHours(), (d.getMinutes() < 10 ? "0" : "") + d.getMinutes(), (d.getSeconds() < 10 ? "0" : "") + d.getSeconds()].join(":");
}

function log(event, mode, type, data, test = false) {
	logdata += [formatDate(), username, type, (test ? "Test" : "") + "3DPass", "", event, mode, data].map(x => '"' + x + '"').join(",") + "\n";
}

var memorize_stack = ['Carleton', 'Travel', 'Store', ''].reverse();
var attempt_stack = shuffle(['Carleton', 'Travel', 'Store']);

var attempt = attempt_stack.pop();

var memorize = memorize_stack.pop();

function memorizing() {
	return memorize != '';
} // not memorizing is the same thing as attempting

step = 1; // step starts at 1

function defaultMemorizeText() {
	infoBox.html('<b>Step ' + step + ':</b> Memorize your <b>' + memorize + '</b> password: ' + valid_passwords[memorize].map(x => '<b class="' + highlights[memorize] + '">' + x + '</b>').join(', ') + ' then enter it.');
}

function defaultAttemptText(correct = false, notify = false) {
	infoBox.html((notify && correct ? '<b style="color:#00FF00">Correct!</b></br>' : notify && !correct ? '<b style="color:#FF0000">Incorrect!</b></br>' : '') + '<b class="ghighlight">Attempt ' + n_attempts + '/3</b></br>' + '<b>Step ' + step + ':</b> Attempt to enter your <b>' + attempt + '</b> password.');
}

function backgroundImage() {
	scene.background = backgrounds[memorizing() ? memorize : attempt][password.length % 8];
}

function changeScene(scene_to) {
	objects = [];
	if (scene_to != 'Carleton') {
		c_mesh.forEach(mesh => {
			scene.remove(mesh);
		});
	} else {
		c_mesh.forEach(mesh => {
			objects.push(mesh);
			scene.add(mesh);
		});
	}

	if (scene_to != 'Travel') {
		t_mesh.forEach(mesh => {
			scene.remove(mesh);
		});
	} else {
		t_mesh.forEach(mesh => {
			objects.push(mesh);
			scene.add(mesh);
		});
	}

	if (scene_to != 'Store') {
		s_mesh.forEach(mesh => {
			scene.remove(mesh);
		});
	} else {
		s_mesh.forEach(mesh => {
			objects.push(mesh);
			scene.add(mesh);
		});
	}
}


function generate_background(label, n) {
	var arr = [];
	for (var i = 1; i <= n; i++) {
		arr.push(new THREE.TextureLoader().load('backgrounds/' + label + '/' + i + '.jpg'));
	}
	return arr;
}

var backgrounds = [];

backgrounds['Carleton'] = generate_background('Carleton', 8);
backgrounds['Travel'] = generate_background('Travel', 8);
backgrounds['Store'] = generate_background('Store', 8);

scene.background = backgrounds[memorize][password.length];

var finished = false;

var highlights = {
	'Carleton': 'ohighlight',
	'Travel': 'bhighlight',
	'Store': 'rhighlight'
};

// Appends the selected object to the tarbet label
function tryMemorize() {
	if (password.length < 8) {
		if (memorizing()) {
			infoBox.html('<b>Step ' + step + ':</b> Entering ' + memorize + ' password! <b style="color: #00FF00">' + (password.length) + '/8</b>.</br>' + valid_passwords[memorize].slice(password.length, valid_passwords[memorize].length).map(x => '<b class="' + highlights[memorize] + '">' + x + '</b>').join(', '));
		}
	} else {
		var pw = verifyPassword();
		log("create", pw ? "success" : "failure", memorize, password.join(''), true);
		resetPassword();
		if (pw) { // memorized password properly, move them to the next step
			memorize = memorize_stack.pop();
			step++;
			if (memorizing()) {
				changeScene(memorize); // change scene
				defaultMemorizeText(); // default text for memorize
			} else {
				// intialize the first attempt
				log("enter", "start", attempt, "");
				changeScene(attempt);
				defaultAttemptText();
				return;
			}
		} else { // mistake during memorizing
			infoBox.html('<b style="color:#FF0000">You made a mistake, try again!</b></br><b>Step ' + step + ':</b> Memorize your <b>' + memorize + '</b> password: ' + valid_passwords[memorize].map(x => '<b class="' + highlights[memorize] + '">' + x + '</b>').join(', ') + ' then enter it.');
		}
		log("create", "start", memorize, "", true);
	}
}

function tryAttempt() {
	if (password.length < 8) {
		infoBox.html('<b class="ghighlight">Attempt ' + n_attempts + '/3</b></br>' + '<b>Step ' + step + ':</b> Attempt to enter your <b>' + attempt + '</b> password. <b style="color: #00FF00">' + (password.length) + '/8</b>');
	} else {
		var pw = verifyPassword();
		log("login", pw ? "success" : "failure", attempt, password.join(''));
		resetPassword(); // reset their password
		n_attempts++;

		if (n_attempts > 3 || pw) { // advance if they get it correct or n_attempts exceeds 3 -> force a scene change or end demo
			if (attempt_stack.length > 0) { // change scene
				step++;
				attempt = attempt_stack.pop();
				n_attempts = 1;
				changeScene(attempt);
				defaultAttemptText(pw, true);
			} else { // end demo
				finishDemo(pw);
				return;
			}
		} else {
			defaultAttemptText(pw, true);
		}
		log("enter", "start", attempt, "");
	}
}

function finishDemo(correct) {
	finished = true;
	infoBox.html((correct ? '<b style="color:#00FF00">Correct!</b>' : '<b style="color:#FF0000">Incorrect!</b>') + '</br><b style="color:#00FF00">Demo completed.</b> Thanks for participating!');
	submitLog();
}

function verifyPassword() {
	if (password == undefined) {
		return false;
	}

	let rp = password.join('');
	for (var key in valid_passwords) {
		if (valid_passwords[key] != undefined && Array.isArray(valid_passwords[key])) {
			if (rp == valid_passwords[key].join('')) {
				return true;
			}
		}
	}
	return false;
}

log("create", "start", memorize, "", true);
defaultMemorizeText();

var animate = function() {
	requestAnimationFrame(animate);

	if (selected && !finished) {
		let elapsed = (new Date() - startTime) / 1000;
		for (var i = 0; i < selected.material.length; i++) {
			selected.material[i].transparent = true;
			selected.material[i].opacity = Math.cos(elapsed * Math.PI / 2);
		}
		selected.rotation.y = Math.cos(k) * Math.PI;
		if (elapsed >= 0.5) {
			password.push(selected.label);

			if (memorizing()) {
				tryMemorize();
			} else {
				tryAttempt();
			}
			resetObjects(); // also resets opacity of selected, be careful
			selected = null;
			backgroundImage();
		}
	}

	renderer.render(scene, camera);
	k += 0.01;
};


window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);

animate();