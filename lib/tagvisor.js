/* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1/GPL 2.0/LGPL 2.1
*
* The contents of this file are subject to the Mozilla Public License Version
* 1.1 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
*
* Software distributed under the License is distributed on an "AS IS" basis,
* WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
* for the specific language governing rights and limitations under the
* License.
*
* The Original Code is TelaSocial TagVisor
*
* The Initial Developer of the Original Code is Taboca TelaSocial.
* Portions created by the Initial Developer are Copyright (C) 2011
* the Initial Developer. All Rights Reserved.
*
* Contributor(s):
* Marcio Galli <mgalli@taboca.com>
*
* Alternatively, the contents of this file may be used under the terms of
* either the GNU General Public License Version 2 or later (the "GPL"), or
* the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
* in which case the provisions of the GPL or the LGPL are applicable instead
* of those above. If you wish to allow use of your version of this file only
* under the terms of either the GPL or the LGPL, and not to allow others to
* use your version of this file under the terms of the MPL, indicate your
* decision by ddomElementting the provisions above and replace them with the notice
* and other provisions required by the GPL or the LGPL. If you do not ddomElementte
* the provisions above, a recipient may use your version of this file under
* the terms of any one of the MPL, the GPL or the LGPL.
*
* ***** END LICENSE BLOCK ***** */

var tv = { 

	currentTick : null, 
	playMode: false, 
	debug:false,
	counterSequential: 0,
	ticksSerialized: new Array(),
	viewWidth: null,
	viewHeight: null, 
	itemsByTicks: new Array(),
	sortedItems: new Array(),
	dataStyle: ".slide { position:relative; }  ", 

	dumpTransform: function (property) { 
		return prop+";-ms-"+prop+";-webkit-"+prop+";-moz-"+prop+";-o-"+prop+";";
	},

	setup: function (viewportAttributes) { 
		var dataStyle = this.dataStyle + "#viewport { " + viewportAttributes + "} #pagescale { width:1200px; } ";
		var inlinestyle = document.createElement('link');
		inlinestyle.setAttribute("rel","stylesheet");
		inlinestyle.setAttribute("href","data:text/css,"+ escape(dataStyle));
		document.getElementsByTagName("head")[0].appendChild(inlinestyle);
	}, 

	refreshView: function (d) { 
		this.viewLeft = d.getElementById("viewport").offsetLeft;
		this.viewTop =  d.getElementById("viewport").offsetTop;
		this.viewWidth = d.getElementById("viewport").offsetWidth;
		this.viewHeight =  d.getElementById("viewport").offsetHeight;
	}, 

	sortArray: function (arr){
	  var sortedKeys = new Array();
	  var sortedObj = {};
	  for (var i in arr){
		sortedKeys.push(i);
	  }
	  sortedKeys.sort(this.sortNumber);
	  for (var i in sortedKeys){
		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
	  }
	  return sortedObj;
	},

	sortNumber: function (a,b) {
		return a - b;
	},

	add:function (list) { 
		for(var i=0;i<list.length;i++) { 
			var item = list[i];
			var time = item.getAttribute("data-time");
			if(time) { 
			if(time.indexOf("s")>-1) { 
				var secs = time.split("s")[0];
				// we use 2 ticks per sec
				var tickStamp = parseInt(secs*2); 
				this.itemsByTicks[tickStamp] = item; 
			} 
			} 
		} 	
	} ,
	
	play: function () { 
		this.playMode=true; 
		this.sortedItems = this.sortArray(this.itemsByTicks);
		var i=0;
		for (key in this.sortedItems) { 
			this.ticksSerialized[i]=key;
			i++;
		} 
		this.ticksSerialized[i]=-1;
		this.currentTick=0;
		this.counterSequential=0;
		this.tick();
	} ,

	tick: function () { 
		if(this.playMode) { 
			try { 
				var nextTick = this.ticksSerialized[this.counterSequential];
				if(nextTick > -1) {
					if(nextTick==this.currentTick) { 
						var lookUpElement = this.itemsByTicks[this.currentTick];
						if(lookUpElement) {  

							var currDoc = document;	
							if(lookUpElement.getAttribute("data-scope")) { 
								var sp = lookUpElement.getAttribute("data-scope").split(" ");
		
								for(var i=0;i<sp.length;i++) { 
									var newDoc = currDoc.getElementById(sp[i]).contentDocument; 
									if(newDoc) { 
										currDoc=newDoc;
									} 
								} 
				
							} 
							
							var targetElement = currDoc.getElementById(lookUpElement.getAttribute("data-target"));
							var fCommand ="";

							fCommand = lookUpElement.getAttribute("data-exec"); 

							if(fCommand!=null) { 
							if(fCommand.indexOf('dispatch')>-1) { 
try { 
								var str = fCommand.split("dispatch_load('"); 
								var str1 = str[1].split("'");
								var url = str1[0];
								lookUpElement.src=url+"?"+Math.random();
} catch (i) {  } 
							} 
							} 

							var fEffect = null; 
							var fDuration = null;
							try { fEffect = lookUpElement.getAttribute("data-effect"); } catch (i) { } 
							try { fDuration = lookUpElement.getAttribute("data-duration"); } catch(i) { } 
							var dur = 2;
							if(fDuration != null) { 
								dur=parseInt(fDuration);	
							} 
							if(fEffect == 'scalefit') { 
								this.effects_scale(targetElement,dur, currDoc);
							} 
							if(fEffect == "fadeout") { 
								this.effects_fadeOut(targetElement,dur);
							} 
							if(fEffect == "flip3d") { 
								this.effects_flip3d(targetElement,dur);
							} 
							if(fEffect == "move") { 
								this.effects_animateNext(targetElement, currDoc,dur, false);
							} 
							if(fEffect == "movecenter") { 
								this.effects_animateNext(targetElement, currDoc,dur, true);
							} 
							this.counterSequential++;
						} 
					} 
					this.currentTick++;
					var stampThis = this; 
					setTimeout(function () { stampThis.tick() } ,500); 

				} else { 
					//end
	
					this.playMode = false;
				} 
	
			} catch (i) { 
				this.currentTick++;
				var stampThis = this; 
				setTimeout(function () { stampThis.tick() } ,500); 
			}
		} 
	} ,

	offset: function (domElement) {
	        if(!domElement) domElement = this;
	        var x = domElement.offsetLeft;
	        var y = domElement.offsetTop;
	        while (domElement = domElement.offsetParent) {
	                x += domElement.offsetLeft;
	                y += domElement.offsetTop;
	        }
        	return { left: x, top: y };
	},
	
	effects_fadeOut: function (el, t) { 
	        el.setAttribute("style","-moz-transition-property: opacity; -moz-transition-duration:"+t+"s;opacity:0");
	},

	effects_flip3d: function (el, t) { 
	        var moz = "-moz-transition-property: -moz-transform; -moz-transition-duration:"+t+"s;-moz-transform: perspective( 400px ) rotateY(360deg);"
	        var webkit = "-webkit-transition-property: -webkit-transform; -webkit-transition-duration:"+t+"s;-webkit-transform: perspective( 400px ) rotateY(360deg);"
	        el.setAttribute("style", moz + webkit);
	},

	effects_scale: function (a, t, d) { 

		var x = 0; 
		var y = 0;
		var center = true;
		this.refreshView(d); 
		var el = this.offset(a);

		if(!center) { 
			var x= el.left - this.viewLeft;
			var y= el.top - this.viewTop;
		} else { 
			var x= el.left - this.viewLeft - parseInt((this.viewWidth - parseInt(a.offsetWidth))/2);	
			var y= el.top - this.viewTop - parseInt((this.viewHeight - parseInt(a.offsetHeight))/2);	
		} 
	        d.getElementById("pagetranslate").setAttribute("style","-moz-transition-property: -moz-transform; -moz-transform:translate("+-1*x+","+-1*y+"); -moz-transition-duration:"+t+"s; -webkit-transition-property: -webkit-transform; -webkit-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -webkit-transition-duration:"+t+"s; -o-transition-property: -o-transform; -o-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -o-transition-duration:"+t+"s;");

		var el = this.offset(a);
		var sW = this.viewWidth/a.offsetWidth;
		var sH = this.viewHeight/a.offsetHeight;

		var sC = 0;
	
		var x= el.left - this.viewLeft +  parseInt( parseInt(a.offsetWidth)/2);	
		var y= el.top -this.viewTop +  parseInt( parseInt(a.offsetHeight)/2);	

		var probeHeight = a.offsetHeight*sW;
		if(probeHeight<=this.viewHeight) { 
			sC = sW ;
		} 
		else { 
		 sC = sH;
		} 
	        var str =   "-moz-transform-origin: " + x + "px " + y + "px;-moz-transition-property: -moz-transform, -moz-transform-origin; -moz-transition-duration:"+t+"s;-moz-transform:scale("+sC+");";
	        str += "-webkit-transform-origin: " + x + "px " + y + "px;-webkit-transition-property: -webkit-transform, -webkit-transform-origin; -webkit-transition-duration:"+t+"s;-webkit-transform:scale("+sC+");";
	        d.getElementById("pagescale").setAttribute("style",str);
	},
	effects_animateNext: function (a,d,t,center) { 

		var el = this.offset(a);
		var x = 0; 
		var y = 0;
		this.refreshView(d);
		if(!center) { 
			var x= el.left - this.viewLeft;
			var y= el.top - this.viewTop;
		} else { 
			var x= el.left - this.viewLeft - parseInt((this.viewWidth - parseInt(a.offsetWidth))/2);	
			var y= el.top - this.viewTop - parseInt((this.viewHeight - parseInt(a.offsetHeight))/2);	
		} 
		var ww = a.offsetWidth;
		var www = window.innerWidth;		        
	        var scale = www/(ww+800);

		//document.getElementById("pagescale").setAttribute("style"," -moz-transition-property: -moz-transform; -moz-transform:scale("+scale+"); -moz-transition-duration:3s;  -webkit-transition-property: -webkit-transform; -webkit-transform:scale("+scale+"); -webkit-transition-duration:3s;  -o-transition-property: -o-transform; -o-transform:scale("+scale+"); -o-transition-duration:3s;");
	
		x-=0;
	        d.getElementById("pagetranslate").setAttribute("style","-moz-transition-property: -moz-transform; -moz-transform:translate("+-1*x+","+-1*y+"); -moz-transition-duration:"+t+"s; -webkit-transition-property: -webkit-transform; -webkit-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -webkit-transition-duration:"+t+"s; -o-transition-property: -o-transform; -o-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -o-transition-duration:"+t+"s;");
	} 

} 


