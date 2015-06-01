/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        document.getElementById("splash").style.display = 'none';
        document.getElementById("demo").style.display = 'block';
        draw();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();


var svg;

function draw() {
    $(document).ready(function(){
        var winWidth = $(window).width()-10;
        var winHeight = $(window).height()-10;
        var xSize = 50;
        var ySize = 40;

        var xscale = d3.scale.linear()
                   .domain([0,xSize])
                   .range([0,winWidth]),
        yscale = d3.scale.linear()
                   .domain([0,ySize])
                   .range([0,winHeight]),
        map = d3.floorplan().xScale(xscale).yScale(yscale),
        imagelayer = d3.floorplan.imagelayer(),
        heatmap = d3.floorplan.heatmap(),
        vectorfield = d3.floorplan.vectorfield(),
        pathplot = d3.floorplan.pathplot(),
        //desks = d3.floorplan.pathplot(),
        overlays = d3.floorplan.overlays().editMode(true),
        mapdata = {};

        mapdata[imagelayer.id()] = [{
            url: 'Sample_Floorplan.jpg',
            x: 0,
            y: 0,
            height: ySize,
            width: xSize,
            opacity: 0.7
             }];

        map.addLayer(imagelayer)
           //.addLayer(heatmap)
           //.addLayer(vectorfield)
           .addLayer(pathplot)
           //.addLayer(overlays)
           //.addLayer(desks)
           ;

        d3.json("data/demo-data.json", function(data) {
            mapdata[heatmap.id()] = data.heatmap;
            mapdata[overlays.id()] = data.overlays;
            mapdata[vectorfield.id()] = data.vectorfield;
            mapdata[pathplot.id()] = data.pathplot;
            //mapdata[desks.id()] = data.desks;

            svg = d3.select("#demo").append("svg");
            svg.attr("height", winHeight).attr("width",winWidth)
                .datum(mapdata).call(map);

            svg.on('click', function () {
               var coord = d3.mouse(this);
               var x = Math.round( (coord[0] * xSize) / winWidth * 100  ) / 100;
               var y = Math.round( (coord[1] * ySize) / winHeight * 100 ) / 100;
               mapdata[pathplot.id()][0].points.push({x:x,y:y})
               console.log(JSON.stringify(mapdata[pathplot.id()][0].points));
               svg.datum(mapdata).call(map);
            });
        });

    });

}