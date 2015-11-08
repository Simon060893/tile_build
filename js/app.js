var App = function (name) {
    var webglElem = {tiles: {wallF: [], wallS: {byL: [], byH: []}, floor: []}},
        remoteData = { skbxImg: []},
        saveData=[];
    var utils = {
        events: {
            onWindowResize: function () {
                webglElem.camera.aspect = window.innerWidth / window.innerHeight;
                webglElem.controls.handleResize();
                webglElem.camera.updateProjectionMatrix();
                webglElem.gl.setSize(window.innerWidth, window.innerHeight);
            },
            onMouseMove: function (event) {
                event.preventDefault();
                var cNm = App.const.containerName, canvas = $('#' + cNm + ' canvas')[0], canvasW = $(canvas).width(),
                    canvasH = $(canvas).height(), mouseVector = {}, lastInters = webglElem.lastInters;
                $(canvas).css('cursor', 'auto');
                if (lastInters) {
                    lastInters.object.position.z = lastInters.object.lastPos ? lastInters.object.lastPos : lastInters.object.position.z;
                }
                mouseVector.x = ( (event.clientX - canvas.offsetLeft + 1) / canvasW) * 2 - 1;
                mouseVector.y = -( (event.clientY - canvas.offsetTop) / canvasH) * 2 + 1;
                webglElem.projector.setFromCamera(mouseVector, webglElem.camera);
                if (webglElem.tiles.wallS.byL.length > 0) {
                    lastInters = webglElem.projector.intersectObjects(webglElem.tiles.wallS.byL)[0];
                    if (lastInters) {
                        lastInters.object.lastPos = lastInters.object.position.z + 0;
                        if (lastInters && lastInters.object) {
                            if (webglElem.lastInters && webglElem.lastInters.object != lastInters.object) {
                                webglElem.sounds[0].play()
                            }
                            webglElem.lastInters = lastInters;
                            lastInters.object.position.z += 0.5;
                            $(canvas).css('cursor', 'pointer');
                        }
                    }
                }
            },
            onDoubleClick: function () {
                webglElem.controls.reset();
                webglElem.camera.position.set(0, 0, 50);
            },
            onTextureLoadL: function () {
                $('input[type="file"]').on('change', function (evt) {
                    var file_name = this.value.replace(/\\/g, '/').replace(/.*\//, '');
                    if (file_name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                        // FileReader support
                        if (FileReader) {
                            var tgt = evt.target || window.event.srcElement,
                                files = tgt.files;
                            var fr = new FileReader();
                            fr.readAsDataURL(files[0]);
                            fr.onload = function () {
                                $('#' + App.const.loadImageText).attr('src', fr.result);
                                setTimeout(function () {
                                    var size = $('#' + App.const.loadImageText)[0].height;
                                    App.resetTexture(size);
                                    setTimeout(function () {
                                        var canvas = document.getElementById('texture');
                                        var textures = new THREE.Texture(canvas);
                                        //textures.wrapS = THREE.RepeatWrapping;
                                        //textures.wrapT = THREE.RepeatWrapping;
                                        //textures.repeat.set( 2, 2 );
                                        for (var i = 0; i < webglElem.scene.children.length; i++) {
                                            var cur = webglElem.scene.children[i];
                                            if (cur.typ == 'wall') {
                                                cur.material = new THREE.MeshBasicMaterial({map: textures});
                                            }
                                        }
                                    }, 100);
                                }, 100);
                            }
                        } else {
                            arert('update your browser');
                        }
                    }
                });
            }
        },
        methods: {
            init: function () {
                var container, gl, scene, camera, controls;
                container = document.createElement('div');
                container.id = name;
                container.style.position = 'absolute';
                container.style.top = 0;
                container.style.left = 0;
                App.const.containerName = name;
                container.style.zIndex = 1;
                webglElem.container = container;
                document.body.appendChild(container);
                //create render
                gl = new THREE.WebGLRenderer({antialiasing: true, alpha: true, antialias: true});
                gl.setClearColor(0x000000, 1);
                gl.setSize(window.innerWidth, window.innerHeight);
                gl.gammaInput = true;
                gl.gammaOutput = true;
                gl.sortObjects = false;
                gl.setPixelRatio(window.devicePixelRatio);
                gl.shadowMap = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
                container.appendChild(gl.domElement);
                webglElem.gl = gl;

                //ray
                webglElem.projector = new THREE.Raycaster();

                //sounds
                var sound1 = new Sound(['data/sounds/A.mp3']);
                webglElem.sounds = [sound1];



                //create scene
                scene = new THREE.Scene();
                webglElem.scene = scene;
                //skybox
                var materialArray = [],
                    skyGeometry = new THREE.BoxGeometry(500, 500, 500), skyBox;
                for (var i = 0; i < 6; i++)
                    materialArray.push(new THREE.MeshBasicMaterial({
                        map:  remoteData.skbxImg[i],
                        side: THREE.BackSide
                    }));
                skyBox = new THREE.Mesh(skyGeometry, new THREE.MeshFaceMaterial(materialArray));
                scene.add(skyBox);
                //add camera
                camera = new THREE.PerspectiveCamera(45, (window.innerWidth) / window.innerHeight, 1, 2220);
                //camera.position.set(25, 25, 25);
                camera.position.set(0, 0, 50);
                camera.lookAt(scene.position);
                webglElem.camera = camera;


                //fill objects
                //var types = ['wall','wall_bottom','carniez',]
                // var canvas = document.getElementById('texture');
                // var textures = new THREE.Texture(canvas);
                // textures.needsUpdate = true;
                webglElem.fill_object = new THREE.Object3D();
                scene.add(webglElem.fill_object);
                webglElem.till_object = new THREE.Object3D();
                scene.add(webglElem.till_object);

                /*tills*/


                //add lights
                scene.add(new THREE.AmbientLight("#555555"));
                scene.add(new THREE.AxisHelper(10));
                var light = new THREE.PointLight("#ffffff", 1, 200);
                light.position.set(5, 5, 5);
                scene.add(light);

                controls = new THREE.TrackballControls(camera, gl.domElement);
                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;
                controls.noZoom = false;
                controls.noPan = false;
                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;
                controls.keys = [65, 83, 68];
                controls.maxDistance = 100;
                controls.minDistance = 10;
                webglElem.controls = controls;

                utils.events.onTextureLoadL();
                controls.addEventListener('change', this.render);
                window.addEventListener('resize', utils.events.onWindowResize, false);
                window.addEventListener('mousemove', utils.events.onMouseMove, false);
                window.addEventListener('dblclick', utils.events.onDoubleClick, false);
            },
            render: function () {
                webglElem.gl.render(webglElem.scene, webglElem.camera);
            },
            animate: function () {
                webglElem.controls.update();
                requestAnimationFrame(utils.methods.animate);
                utils.methods.render();
            }
        }
    }
    var Sound = function (sources) {
        var audio = document.createElement('audio');

        for (var i = 0; i < sources.length; i++) {
            var source = document.createElement('source');
            source.src = sources[i];
            audio.appendChild(source);
        }

        this.play = function () {
            audio.load();
            audio.play();
        }
    }
    //this.utils=utils;
    //this.webglObj=webglElem;
    this.guiObj = {
        fields: {
            gui: null,
            fizzyText: {
                loadImg: function () {
                    $('#loadTexture').click();
                },
                getTextures: function () {
                    var filename='textures.zip', strMime = "image/jpeg";
                    var zip = new JSZip();
                    zip.file("README.txt", "Hello World\n");
                    var img = zip.folder("images");
                    for(var i=0;i< saveData.length;i++){
                        var sd = saveData[i].toDataURL();
                            img.file("texture"+i+".jpg",sd.substr(sd.indexOf(',')+1), {base64: true});

                    }
                    var content = zip.generate({type:"blob"});
                    saveAs(content, filename);
                },
                roomL: App.const.curRoomL,
                roomH: App.const.curRoomH,
                tileF: [],
                tileH: 800,
                tileL: 500,
                fillColor: '#a92e0f',
                fillSize: App.const.fill * 10
            }
        },
        init: function () {
            var gui = this.fields.gui = new dat.GUI({width: 350}), fizzyText = this.fields.fizzyText;
            // Text field
            var countUnvis = {onWidth: 0, onHeight: 0};
            var guiSettings = gui.addFolder('Entire texture');
            var roomEdit = guiSettings.addFolder('Room Size');
            var tillEdit = guiSettings.addFolder('Till Size');
            var fillEdit = guiSettings.addFolder('Fill Edit');


            var minLength = App.const.minLength, maxLength = App.const.maxLength;
            roomEdit.add(fizzyText, 'roomL', minLength, maxLength).step(100).name('Room Length(mm)').onChange(function (val) {
                //var cur = val / (maxLength / 2);
                App.const.curRoomL = val;
                webglElem.wall_fill_f.scale.x = val / (maxLength / 2);
                webglElem.floor.scale.x = val / (maxLength / 2);
                webglElem.wall_fill_f.position.x = webglElem.floor.position.x = (val / (maxLength / 2)) * (30) - 30;
                var cur = App.const.curWalTil.split('*'),
                    maxLVisEl = val / parseInt(cur[0]),
                    maxHVisEl = val / parseInt(cur[1]),
                    visibleEl = maxLVisEl * maxHVisEl;
                var curWallTil = webglElem.tiles.wallS.byL;
                var maxHeight = countUnvis.onHeight + 0, widthStep = App.const.countTiles.onHeight.max + 0, c = 0, flag = false, countUnVisi = 0;
                for (var i = 0; i < curWallTil.length; i++) {
                    if (i >= c && i < maxHeight) {
                        flag = true;
                    } else {
                        if (flag) {
                            flag = false;
                            c += widthStep;
                            maxHeight += widthStep;
                        }
                        if (i < visibleEl) {
                            curWallTil[i].visible = true;
                        } else {
                            curWallTil[i].visible = false;
                            countUnVisi++;
                        }
                    }

                }
                countUnvis.onWidth = Math.round(countUnVisi / (App.const.countTiles.onHeight.max));

            });
            var minHeight = App.const.minHeight, maxHeight = App.const.maxHeight;
            roomEdit.add(fizzyText, 'roomH', minHeight, maxHeight).step(100).name('Room Hight(mm)').onChange(function (val) {
                webglElem.wall_fill_f.scale.y = val / minHeight;
                webglElem.wall_fill_s.scale.y = val / minHeight;
                webglElem.wall_fill_f.position.y = webglElem.wall_fill_s.position.y = (val / minHeight) * (15) - 15;

                App.const.curRoomH = val;
                var cur = App.const.curWalTil.split('*'),
                    maxLVisEl = (val) / parseInt(cur[0]),
                    maxHVisEl = (2 * val) / parseInt(cur[1]),
                    visibleEl = maxLVisEl * maxHVisEl;
                var maxLength = App.const.countTiles.onWidth.max + 0, lengthStep = maxLength + 0, flag = false, countUnVisi = 0;
                var curWallTil = webglElem.tiles.wallS.byH;
                for (var i = 0; i < curWallTil.length; i++) {
                    if (i >= (maxLength - countUnvis.onWidth) && i < maxLength) {
                        flag = true;
                    } else {
                        if (flag) {
                            flag = false;
                            maxLength += lengthStep;
                        }
                        if (i < visibleEl) {
                            curWallTil[i].visible = true;
                        } else {
                            curWallTil[i].visible = false;
                            countUnVisi++;
                        }
                    }

                }
                countUnvis.onHeight = Math.round(countUnVisi / (App.const.countTiles.onWidth.max));
            });
            var tillSize = [100, 800];
            tillEdit.add(fizzyText, 'tileL', tillSize[0], tillSize[1]).step(50).name('Till Length(mm)').onChange(function (val) {
                App.const.curWalTil = val + App.const.curWalTil.substr(App.const.curWalTil.indexOf('*'));
            });
            tillEdit.add(fizzyText, 'tileH', tillSize[0], tillSize[1]).step(50).name('Till Hight(mm)').onChange(function (val) {
                App.const.curWalTil = App.const.curWalTil.substr(0, App.const.curWalTil.indexOf('*') + 1) + val;
            });


            fillEdit.addColor(fizzyText, 'fillColor').name('Fill Color').onChange(function (val) {
                for (var i = 0; i < webglElem.fill_object.children.length; i++) {
                    webglElem.fill_object.children[i].material.color.setHex('0x' + val.substr(1));
                }
            });
            fillEdit.add(fizzyText, 'fillSize', 1, 10).step(1).name('Fill Color(mm)').onChange(function (val) {
                var newFill = val / 10, listOfTils = webglElem.tiles.wallS.byL;
                App.const.fill = newFill;


                var curTillSize = App.const.curWalTil.split("*"),
                    tileLength = parseInt(curTillSize[0]),
                    tileHeight = parseInt(curTillSize[1]),
                    countOfWallTilByLength = {
                        max: App.const.maxLength / tileLength,
                        cur: Math.floor(App.const.curRoomL / tileLength)
                    },
                    countOfWallTilByHeight = {
                        max: App.const.maxHeight / tileHeight,
                        cur: Math.floor(App.const.curRoomH / tileHeight)
                    },
                    strP = {x: -30, y: 15, z: -15, scl: 100};

                var k = countOfWallTilByHeight.max - 1, l = 0;

                for (var i = 0; i < countOfWallTilByLength.max; i++) {
                    var y = strP.y + 0;
                    for (var j = 0; j < countOfWallTilByHeight.max; j++) {

                        listOfTils[l].position.y = y;
                        listOfTils[l++].position.x = strP.x;
                        y -= (tileHeight / strP.scl) + newFill
                    }
                    strP.x += (tileLength / strP.scl) + newFill;
                }


            });

            guiSettings.add(fizzyText, 'tileF', App.const.plitaFollrSize).name('Floor Tile Size').onChange(function (val) {
                App.const.curFloorTil = val;
            });
            guiSettings.add(fizzyText, 'loadImg').name('Load Texture');
            guiSettings.add(fizzyText, 'getTextures').name('Get Textures');
            //$(".hue-field").width(10);
            //$("select").css('color', 'black');
        }
    }
    var tilles = {
        rebuild: function (type, textures) {
            var curTillSize = App.const.curWalTil.split("*"),
                tileLength = parseInt(curTillSize[0]),
                tileHeight = parseInt(curTillSize[1]),
                countOfWallTilByLength = {
                    max: App.const.maxLength / tileLength,
                    cur: Math.floor(App.const.curRoomL / tileLength)
                },
                countOfWallTilByHeight = {
                    max: App.const.maxHeight / tileHeight,
                    cur: Math.floor(App.const.curRoomH / tileHeight)
                },
                strP = {x: -30, y: 15, z: -15, scl: 100}, stepL = 0, stepH, exp = 1,
                fill = App.const.fill, stepL = 0;
            for (var i = 0; i < countOfWallTilByLength.max; i++) {
                /*var canvas = false;
                 if (countOfWallTilByLength.cur > i) {
                 canvas = document.createElement('canvas');
                 canvas.width = tileLength / exp;
                 canvas.height = tileHeight / exp;
                 canvas.getContext('2d').drawImage(textures, stepL, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                 }
                 this.createPlate({
                 width: tileLength / strP.scl,
                 height: tileHeight / strP.scl,
                 type: type,
                 pos: {x: strP.x, y: strP.y, z: strP.z}
                 }, canvas);*/
                var y = strP.y + 0, stepH = 0;
                for (var j = 0; j < countOfWallTilByHeight.max; j++) {
                    var canvas = false;
                    canvas = document.createElement('canvas');
                    canvas.width = tileLength / exp;
                    canvas.height = tileHeight / exp;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#70F043';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    if (countOfWallTilByHeight.cur >= j && countOfWallTilByLength.cur > i) {
                        saveData.push(canvas);
                        ctx.drawImage(textures, stepL, stepH, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                        stepH += (tileHeight / exp);
                    }
                    this.createPlate({
                        width: tileLength / strP.scl,
                        height: tileHeight / strP.scl,
                        type: type,
                        pos: {x: strP.x, y: y, z: strP.z}
                    }, canvas);
                    y -= (tileHeight / strP.scl) + fill
                }
                strP.x += (tileLength / strP.scl) + fill;
                stepL += (tileLength / exp);
            }

            /* for height visibilirt*/
            var curWallTil = webglElem.tiles.wallS.byL.concat(), k = countOfWallTilByHeight.max - 1;
            for (var i = 0; i < curWallTil.length; i += countOfWallTilByLength.max) {
                for (var j = 0; j < curWallTil.length; j += countOfWallTilByHeight.max) {
                    webglElem.tiles.wallS.byH.push(curWallTil[j + k]);
                }
                k--;
            }
            App.const.countTiles = {onWidth: countOfWallTilByLength, onHeight: countOfWallTilByHeight};
        },
        createPlate: function (par, textures) {
            var material;
            if (textures) {
                var text = new THREE.Texture(textures);
                text.needsUpdate = true;
                material = new THREE.MeshBasicMaterial({map: text});
            } else {

                material = new THREE.MeshBasicMaterial({color: 0xd92e0f})
            }
            var tile = new THREE.Mesh(new THREE.PlaneGeometry(par.width, par.height), material);
            tile.typ = par.type;
            tile.position.z = par.pos.z//-14.5;
            tile.position.y = par.pos.y//-14.5;
            tile.position.x = par.pos.x//-29.5;
            webglElem.till_object.add(tile);
            webglElem.tiles.wallS.byL.push(tile);

        },
        textureLoad: function (callback) {
            var myImage = new Image(), textures = [];
            myImage.src = 'data/img/plita.jpg';
            myImage.onload = function () {
                var stepL = 0, stepH = 0, exp = 1, curTillSize = App.const.curWalTil.split("*"),
                    tileLength = parseInt(curTillSize[0]),
                    tileHeight = parseInt(curTillSize[1]),
                    countOfWallTilByLength = myImage.width / (tileLength / exp),
                    countOfWallTilByHeight = myImage.height / (tileHeight / exp);

                var canvasM = document.createElement('canvas'), ctx = canvasM.getContext('2d');
                canvasM.width = App.const.curRoomL;
                canvasM.height = App.const.curRoomH;
                //ctx.fillStyle = 0xd92e0f;
                //ctx.fillRect(stepL, 0, canvasM.width, canvasM.height);
                ctx.drawImage(myImage, stepL, 0, myImage.width, myImage.height, 0, 0, canvasM.width, canvasM.height);
                countOfWallTilByLength = canvasM.width / (tileLength / exp),
                    countOfWallTilByHeight = canvasM.height / (tileHeight / exp );

                /* for (var i = 0; i < countOfWallTilByLength; i++) {
                 var canvas = document.createElement('canvas');
                 canvas.width = tileLength /exp;
                 canvas.height = tileHeight /exp;
                 canvas.getContext('2d').drawImage(canvasM, stepL, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                 textures.push(canvas);
                 stepH = 0
                 for (var j = 0; j < countOfWallTilByHeight; j++) {
                 var canvas = document.createElement('canvas');
                 canvas.width = tileLength /exp;
                 canvas.height = tileHeight /exp;
                 canvas.getContext('2d').drawImage(canvasM, stepL, stepH, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                 textures.push(canvas);
                 stepH += tileHeight/exp;
                 }
                 stepL += tileLength/exp;
                 }*/
                //console.log(App);
                tilles.rebuild('', canvasM);
                callback();
            }

        },
        createFilled: function () {
            var roomLeng = App.const.countTiles.onWidth.max * App.const.fill, roomH = App.const.countTiles.onHeight.max * App.const.fill;
            webglElem.wall_fill_f = new THREE.Mesh(new THREE.PlaneGeometry(60 + roomLeng, 30 + roomH), new THREE.MeshBasicMaterial({color: '#a92e0f'}));
            webglElem.wall_fill_f.typ = 'wall';
            webglElem.wall_fill_f.position.z = -15.001 - roomH / 2;
            webglElem.fill_object.add(webglElem.wall_fill_f);
            webglElem.wall_fill_s = new THREE.Mesh(new THREE.PlaneGeometry(30 + (roomLeng / 2), 30 + roomH), new THREE.MeshBasicMaterial({color: '#a92e0f'}));
            webglElem.wall_fill_s.typ = 'wall';
            webglElem.wall_fill_s.rotation.y = Math.PI / 2;
            webglElem.wall_fill_s.position.x = -30 - roomLeng / 2;
            webglElem.wall_fill_s.visible = false;
            webglElem.fill_object.add(webglElem.wall_fill_s);
            webglElem.floor = new THREE.Mesh(new THREE.PlaneGeometry(60 + roomLeng, 30 + roomH), new THREE.MeshBasicMaterial({
                color: '#a92e0f',
                side: THREE.DoubleSide
            }));
            webglElem.floor.typ = 'floor';
            webglElem.floor.position.y = -15 - roomH / 2;
            webglElem.floor.rotation.x = Math.PI / 2;
            webglElem.floor.visible = false;
            webglElem.fill_object.add(webglElem.floor);


            var curTillSize = App.const.curWalTil.split("*"),
                tileLength = parseInt(curTillSize[0]),
                tileHeight = parseInt(curTillSize[1]);
            webglElem.till_object.position.x += (tileLength / 100) / 2;
            webglElem.till_object.position.y -= (tileHeight / 100) / 2;

        }
    }

//mesh.rotation.y = THREE.Math.degToRad(45);
//    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ).unproject( camera );
//    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
    var gui = this.guiObj;
    var strt = function () {
        gui.init();
        utils.methods.init();
        tilles.textureLoad(tilles.createFilled);
        utils.methods.animate();
    }
    var ImgData = function (listOfimg) {
        THREE.ImageUtils.loadTexture( 'data/img/skybox/'+listOfimg.shift(),THREE.CubeReflectionMapping,function (data) {
            remoteData.skbxImg.push(data);
            if (listOfimg.length) {
                ImgData(listOfimg);
            } else {
                strt();
            }
        });

    }
    new ImgData(App.const.imagePrefix);

}
App.const = {
    loadImageText: 'pic',
    plitaWallSize: [
        '500*800',
        '150*150',
        '150*250',
        '150*900',
        '250*333',
        '275*400',
        '300*900',
    ],
    plitaFollrSize: [
        '200*200',
        ' 275*400',
        '275*602',
        '300*600',
        '800*800',
        '1000*1000',
    ],
    imagePrefix: ['dawnmountain-xpos.png', 'dawnmountain-xneg.png', 'dawnmountain-ypos.png',
        'dawnmountain-yneg.png', 'dawnmountain-zpos.png', 'dawnmountain-zneg.png'],
    curWalTil: '500*800',
    curFloorTil: '500*500',
    curRoomL: 3000,
    curRoomH: 2800,
    minLength: 1000,
    maxLength: 6000,
    minHeight: 1600,
    maxHeight: 3200,
    fill: 0.1
}

var raster;
App.resetTexture = function (heightP) {
    if (!heightP) heightP = $('#' + App.const.loadImageText)[0].height;
    with (paper) {
        paper.setup('texture');
        raster = new Raster(App.const.loadImageText);
        /*raster.onLoad = function () {
         view.viewSize = new Size(heightP, heightP);
         raster.size = new Size(heightP, heightP);
         raster.position = view.center;
         view.draw();
         }*/

        raster.visible = false;
        var gridSize = 10;
        var spacing = 1.2;
        raster.on('load', function () {
            raster.size = new Size(heightP, heightP);
            view.viewSize = new Size(heightP, heightP);
            raster.position = view.center;
            for (var y = 0; y < raster.height; y++) {
                for (var x = 0; x < raster.width; x++) {
                    var color = raster.getPixel(x, y);
                    var path = new Path.Circle({
                        center: new Point(x, y) * gridSize,
                        radius: gridSize / 2 / spacing
                    });
                    path.fillColor = color;
                }
            }
            raster.size = new Size(heightP, heightP);
            view.update();
            view.draw();
            project.activeLayer.position = view.center;
            project.clear();
        });
        project.activeLayer.position = view.center;
    }
}
paper.install(window);

$(document).ready(function () {
    //App.resetTexture();
    //setTimeout(function () {
    var thhreejsApp = new App('plate');
    /*$("#container_image").PictureCut({
     InputOfImageDirectory       : "img",
     PluginFolderOnServer        : "js/libs/jQuery-Picture-Cut-master/",
     FolderOnServer              : "/uploads/",
     EnableCrop                  : true,
     CropWindowStyle             : "Bootstrap"
     });*/
});