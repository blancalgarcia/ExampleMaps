/*!
 * Map: jQuery SVG Map Library
 * @author Raul Dolores Calzadilla
 * @version 1.0
 * @builddate 2017/02/20
 */

var VectorCanvasMap = function (params) {

    var self = this;

    self.paused = false;

	self.params = params || {};
	self.svgurl= params.svgurl;
	self.width = params.width;
	self.height = params.height;
	self.container = params.container

	self.rootGroup = null;
	self.canvas = null;
	self.document = null;

    self.color = params.pathsConfig.color;
	self.selectedColor = params.pathsConfig.selectedColor;
	self.hoverColor = params.pathsConfig.hoverColor;
	self.hoverColors = params.pathsConfig.hoverColors;
	self.hoverOpacity = params.pathsConfig.hoverOpacity;

	self.enableMultiPath = params.enableMultiPath;
	self.multiPaths = params.multiPaths || {};

	self.OnPathClick = function (path) { };
	self.onMouseOver = function (path) { };
	self.onMouseLeave = function (path) { };
	self.onMouseMove = function (e, path) { };

    /*
    Description: Create SVG node
    */
	self.createSvgNode = function () {
		var objectsvg = document.createElementNS('http://www.w3.org/1999/xhtml', "object");

		objectsvg.setAttribute("data", self.svgurl);
		objectsvg.setAttribute("type", "image/svg+xml");
		objectsvg.setAttribute("width", self.width);
		objectsvg.setAttribute("height", self.height);

		$("#" + self.container).append(objectsvg);

		$(objectsvg)[0].addEventListener("load", function() {

			var svgContent = objectsvg.contentDocument;
			var svgElement = $(svgContent).find("svg").first();
			var groupElement = $(svgElement).find("g").first();

			self.document = svgContent;
			self.canvas = svgElement;
			self.rootGroup = groupElement;

			var paths = $(groupElement).find("path");
			

            $.each( paths, function( key, path ){

                if (!self.enableMultiPath) {
                    $(path).hover(
                        function () {
                            if (!self.paused) {
                                $(path).css("transition", "fill 0.6s ease");
                                $(path).css("fill", self.hoverColor);
                                $(path).css("stroke-width", "0");
                            }
                        },
                        function () {
                            if (!self.paused) {
                                $(path).css("transition", "fill 0.6s ease");
                                $(path).css("fill", self.color);
                                $(path).css("stroke-width", "1");
                            }
                        }
                    );
                } else {
                    var idMultiPath = getIdMultiPath($(path).attr("id"));                    
                    var multipaths = getItemMultiPath(idMultiPath);
                    
                    if (idMultiPath > 0) {
                        
                        path.prototype = { multipath: multipaths };

                        $(path).mouseover(
                            function () {
                                
                                $.each(multipaths.paths, function (key, subpath) {
                                    if (!self.paused) {
                                        var objectPath = $(svgContent).find("#" + subpath).first();
                                        $(objectPath).css("transition", "fill 0.6s ease");
                                        $(objectPath).css("fill", self.hoverColor);
                                        $(objectPath).css("stroke-width", "0");
                                        $(objectPath).css("fill-opacity", "0.7");
                                    }
                                });
                            })

                        $(path).mouseout(
                            function () {
                                $.each(multipaths.paths, function (key, subpath) {
                                    if (!self.paused) {
                                        var objectPath = $(svgContent).find("#" + subpath).first();
                                        $(objectPath).css("transition", "fill 0.6s ease");
                                        $(objectPath).css("fill", self.color);
                                        $(objectPath).css("stroke-width", "1");
                                        $(objectPath).css("fill-opacity", "1");
                                    }
                                });
                            });
                    }
                }

                $(path).click(function () {
                    if (!self.paused) {
                        self.OnPathClick(path);
                    }
                });

                $(path).mouseover(function (e) {
                    if (!self.paused) {
                        self.onMouseOver(path);
                    }
                }).mouseout(function (e) {
                    if (!self.paused) {
                        self.onMouseLeave(path);
                    }
                }).mousemove(function (e) {
                    if (!self.paused) {
                        self.onMouseMove(e, path);
                    }

                });

            });

		}, true);
	}

    /*
    Description: Hightlight a path
    */
	self.pathStatusOn = function (path, status) {
	    var objectPath = $(self.canvas).find("#" + path).first();
	    if (status) {
	        $(objectPath).css("transition", "fill 0.6s ease");
	        $(objectPath).css("fill", self.hoverColor);
	        $(objectPath).css("stroke-width", "0");
	        $(objectPath).css("fill-opacity", "0.7");
	    }else{
	        $(objectPath).css("transition", "fill 0.6s ease");
	        $(objectPath).css("fill", self.color);
	        $(objectPath).css("stroke-width", "1");
	        $(objectPath).css("fill-opacity", "1");
	    }

	    return objectPath;
	}

    /*
    Description: Apply a tranform to SVG object
    */
	self.applyTransformParams = function (scale, transX, transY) {

        $(self.rootGroup).animate({ textIndent: scale }, {
        step: function(now,fx) {
            if (now > 1) {
                $(self.rootGroup).attr("transform", "scale(" + (now) + ") translate(" + transX + ", " + transY + ")");
            }
        },
        duration:1000},"linear");
	}

    /*
    Description: Set size to SVG Object
    */
	self.setSize = function (width, height)
	{
		self.canvas.setAttribute("width", width);
		self.canvas.setAttribute("height", height);

		self.width = width;
		self.height = height;
	}

	self.Log = function(){
		console.log(self);
	}

    /*
    Description: Get path of multipath
    */
	var getItemMultiPath = function (id) {

	    var paths = null;
	    
	    $.each(self.multiPaths, function (key, path) {
	        if (path.id == id) {
	            paths = path;
	        }
	    });

	    return paths;
	    
	}

    /*
    Description: Get id associated to multipath
    */
	var getIdMultiPath = function (pathId) {

	    var idMultiPath = 0;
	    
	    $.each(self.multiPaths, function (key, path) {
	        if (path.paths.indexOf(pathId) >= 0) {
	            idMultiPath = path.id;
	        }
	    });

	    return idMultiPath;

	}


	self.createSvgNode();

};


var Map = function (params) {

	var self = this;

	params = params || {};

	self.container = params.container;
    self.width = params.width;
	self.height = params.height;
	self.svgurl = params.svgurl;
    self.baseScale = params.baseScale;
    self.scale = params.scale;
    self.transX = params.transX;
    self.transY = params.transY;
    self.zoomStep = params.zoomStep;
    self.zoomMaxStep = params.zoomMaxStep;
    self.zoomCurStep = params.zoomCurStep;

    self.enableZoom = params.enableZoom;

    self.enableMultiPath = params.enableMultiPath || false;
    self.multiPaths = params.multiPaths || {};

	self.defaultWidth = params.width;
	self.defaultHeight = params.height;

	self.paths = {};
	self.canvas = null;

	self.initialize = function () {
		var canvas = new VectorCanvasMap(config);
		self.canvas = canvas;

	}

    /*
    Description: Calculate  new size
    */
	self.resize = function () {
	  var curBaseScale = self.baseScale;
	  if (self.width / self.height > self.defaultWidth / self.defaultHeight) {
  		self.baseScale = self.height / self.defaultHeight;
  		self.baseTransX = Math.abs(self.width - self.defaultWidth * self.baseScale) / (2 * self.baseScale);
	  } else {
  		self.baseScale = this.width / self.defaultWidth;
  		self.baseTransY = Math.abs(self.height - self.defaultHeight * self.baseScale) / (2 * self.baseScale);
	  }

	  self.scale *= self.baseScale / curBaseScale;
	  self.transX *= self.baseScale / curBaseScale;
	  self.transY *= self.baseScale / curBaseScale;

	}

    /*
    Description: Disable map animations
    */
	self.pause = function () {
	    self.canvas.paused = true;
	}

    /*
    Description: Enable map animations
    */
	self.resume = function () {
	    self.canvas.paused = false;
	}

    /*
    Description: Hightlight a path
    */
	self.pathStatusOn = function (path, status) {
	    return self.canvas.pathStatusOn(path, status);
	}

    /*
    Description: Calculate  new dimensions
    */
    self.applyTransform = function () {
    var maxTransX, maxTransY, minTransX, minTransY;
    if (self.defaultWidth * self.scale <= this.width) {
        maxTransX = (self.width - self.defaultWidth * self.scale) / (2 * self.scale);
        minTransX = (self.width - self.defaultWidth * self.scale) / (2 * self.scale);
    } else {
        maxTransX = 0;
        minTransX = (self.width - self.defaultWidth * self.scale) / self.scale;
    }

    if (self.defaultHeight * self.scale <= this.height) {
        maxTransY = (self.height - self.defaultHeight * self.scale) / (2 * self.scale);
        minTransY = (self.height - self.defaultHeight * self.scale) / (2 * self.scale);
    } else {
        maxTransY = 0;
        minTransY = (self.height - self.defaultHeight * self.scale) / self.scale;
    }

    if (self.transY > maxTransY) {
        self.transY = maxTransY;
    } else if (self.transY < minTransY) {
        self.transY = minTransY;
    }
    if (self.transX > maxTransX) {
        self.transX = maxTransX;
    } else if (self.transX < minTransX) {
        self.transX = minTransX;
    }

    this.canvas.applyTransformParams(self.scale, self.transX, self.transY);
    }


	self.initialize();


};


