// SOME RESPONSIBILITY IN SLIDE ANIMATION BUT PERHAPS THE ESSENCE HERE IS 
// A MUTATION IN -> LEAD TO TRANSFORMS, -> OUT 
// WITH A PROXY APPROACH, IE IT ALLOWS CODE TO REPRESENT FUTURE "IN" OF
// SO WE HAVE A CONTROLLER TO THE DOM/VIEW
/////
//// DOM Mutation Manager 
/// (C) Copyright 2014 — Marcio dos Santos Galli 
//


var tv3 = { 
    microScale:100 // 100 miliseconds
}

tv3.renderScale = parseInt((10*tv3.microScale)/1000);
tv3.animationDelay = parseInt(3*tv3.renderScale);
tv3.slideDelay = (tv3.animationDelay*1000) +(3*tv3.renderScale*1000);

tv3.parentDebugRoot = null;

tv3.debugOn = function (id, parentId, type, rule) { 

  var location = null;
  var refElement = '';

  var tryElement = document.getElementById('debug_'+parentId);

  if(tryElement == null) {
    refElement = 'debugCanvas';
    location = document.getElementById(refElement);
    location.innerHTML += '<div id="debug_'+parentId+'" class="debug debug-'+type+'">('+parentId+')</div>';
  }

  var parent = document.getElementById('debug_'+parentId);

  var tryElement = document.getElementById('debug_'+id);

  if(tryElement == null) {
    parent.innerHTML += '<div id="debug_'+id+'" class="debug debug-'+type+'">'+id+':'+type+'('+rule+')'+'</div>';  
  } else { 

    var tryElement = document.getElementById('debug_'+parentId);
    tryElement.innerHTML+= ':'+type+'('+rule+')['+id+'/'+parentId+']';

    var tryElement2 = document.getElementById('debug_'+id);
    if(tryElement2 != null ) {
        var nNode = tryElement2.cloneNode(true);
        tryElement2.parentNode.removeChild(tryElement2);
        tryElement.appendChild(nNode);
    }
  }
}

tv3.recordNodeConstructor = function () { 

}

tv3.recordNodeConstructor = tv3.debugOn; 


var util = { 

    trim: function (s){ 
        return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
    },

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

    addCSSRule: function (sheet, selector, rules, index) {
      if("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
      }
      else if("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
      }
    }, 

    generateRule: function(str) { 
       var newRuleID = 'sheetInTime_'+parseInt(Math.random()*100000); 
       // we insert at last position
       util.addCSSRule(document.styleSheets[document.styleSheets.length-1], '.'+newRuleID , str);
       return newRuleID;
    }, 

    addClass: function (item, ruleClassId) {
        var currentClass = item.getAttribute('class');
        item.setAttribute('class', currentClass + ' '+ruleClassId)
    }, 

    // We might want to keep track of this..? 
    dumpClass: function (item, ruleClassId) {
        //var currentClass = item.getAttribute('class');
        item.setAttribute('class', ruleClassId)
    }

}

var tv2 = {

    globalCounter : 0, 

    plugins: null, 

    mutationSession : [], 

    generateId : function () { 
        tv2.globalCounter++;
        return (tv2.globalCounter + parseInt(Math.random()*1000000));
    },

    // mutation thread... now...
    mutationRecord : function prototypeMutationObject(tw) { 

        this.id = tv2.generateId();
        this.doneAction = null; /* Effects execution */
        this.classAction = null;
        this.childMutations = [];
        this.parent = null; 

        // Stored pipe values. 
        this.storedPipes = [];
        this.store = new Array(); 
        

        this.queryIncoming = function getIncomingData() { 

            // this might be when we decided on the right approach to query 
            // data which was priorly stored. 
            // top of stored pipes.. 

            var storedLength = this.storedPipes.length; 

            var pipeReality = null; 

            if(storedLength<=0) { 

                for(var i = 0; i<this.childMutations.length;i++) { 
                    var item = this.childMutations[i];
                    if(item.storedPipes.length>0) { 
                        var itemTop = item.storedPipes[item.storedPipes.length-1]
                        pipeReality = item.store[itemTop];
                    }
                }

            } else {    
                var mutationTop = this.storedPipes[this.storedPipes.length-1];
                pipeReality = this.store[mutationTop];
            }

            return pipeReality;

        }

        this.exec = function processMe(tw) { 

            var n = tw.currentNode;
            n.setAttribute('data-mutation', this.id)
            
            for (var child=tw.firstChild();child!=null;child=tw.nextSibling()) {
                var test = new tv2.mutationRecord(tw);
                test.parent = this;
                test.exec(tw);
                this.childMutations.push(test);
            }

            var ruleTest = n.getAttribute('data-animation');
            if(ruleTest != null) { 
                tv3.recordNodeConstructor(this.id, this.parent.id, 'animation', ruleTest); 
                this.processAnimation(n);
            }
            
        }

        this.observerEvents = []

        this.observeEvents = function observer(ev) { 

            var detail = ev.detail; 
            for(var k in this.observerEvents) { 
                if (this.observerEvents[k]==detail) { 
                    this.processAnimation(ev.domElement);
                }   
            }

        }
        /* this will process the actual animation changes via
        executing JavaScript code which may be asynchronous. When it's done, 
        it will make sure to update this element 'done' and callback 
        the parent nevertheless of parent's interest  */ 

        this.processAnimation = function runtimeAnimationProcessor(domElement) { 

            var classRule = domElement.getAttribute('data-animation');

            if(classRule.indexOf('animate')>-1) {

                if(domElement.getAttribute('data-observe') != null ) {
                  this.observerEvents.push(domElement.getAttribute('data-observe'));
                  domElement.setAttribute('data-observe',null);
                  var thatNode = domElement;
                  var that = this;
                  domElement.addEventListener('tvEndSlideEvent', function (e) { 
                        e.domElement = thatNode;
                        that.observeEvents(e);
                  }, true)
                } 

                if(domElement.getAttribute('data-target') != null ) {
                   domElement = domElement.querySelector(domElement.getAttribute('data-target'));
                }      

                this.classAction = util.trim(classRule.split('animate')[1]);

                this.doneAction = this.classAction;

                if(this.classAction == 'slide-fit-window') {
                    tv3.call.fitWindow(domElement, this);
                }
                if(this.classAction == 'slide-camera') {
                    tv3.call.cameraFollow(domElement, this);
                }
                if(this.classAction == 'slide-center-parent') {   
                    tv3.call.centerParent(domElement, this);
                }
                if(this.classAction == 'slide-tilt') {
                    //tv3.call.tilt(domElement, this);
                }
                if(this.classAction == 'inner-typing') {
                    tv3.call.typing(domElement, this);
                }

            }
        }

        this.endSlide = function callbackForEndSlide (refDOMElement) { 
            var newEvent = new CustomEvent("tvEndSlideEvent", 
                               {"domElement": null, "detail": this.classAction}
                               );
            refDOMElement.dispatchEvent(newEvent);
        };

        /* Will add the results to the parent */

        this.recordSubMutation = function record(nodeItem, rule) { 

            var realityWrapper = {
               'node'   : nodeItem,
               'from'   : this.id, 
               'event'  : this.doneAction, 
               'cssRule': rule
            };

            var items = rule.split(';');

            for(ii in items) { 
                var line = items[ii];
                var currAttribute = line.split(':')[0];
                if(currAttribute.indexOf('height')>-1) {
                    realityWrapper.height=parseInt(line.split(':')[1].split('px')[0]);
                }
                if(currAttribute.indexOf('width')>-1) {
                    realityWrapper.width=parseInt(line.split(':')[1].split('px')[0]);
                }
                if(currAttribute.indexOf('top')>-1) {
                    realityWrapper.top=parseInt(line.split(':')[1].split('px')[0]);
                }
                if(currAttribute.indexOf('left')>-1) {
                    realityWrapper.left=parseInt(line.split(':')[1].split('px')[0]);
                }
            }

            this.parent.store[this.id] = realityWrapper;
            this.parent.storedPipes.push(this.id);
            //this.parent.checkObservers();

        }

        //this.exec(tw);

        return this;

    },


    // certain operations will 
    run: function (elementQuery) { 

        var target = document.querySelector(elementQuery);

        var tw = document.createTreeWalker(
          target,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode: function(node) { 
               if(node.getAttribute('data-animation')) { 
                    return NodeFilter.FILTER_ACCEPT;          
               }  else { 
                    return NodeFilter.FILTER_SKIP;          
               }
            }
          },
          false);

        //mut.exec(treeWalker);

        var mut = new this.mutationRecord();
        mut.exec(tw);

    }
}

tv3.call = { 

    // takes element and WINDOW reference 
    fitWindow: function (item, state) {
        
        var mutationId = state.id;

        var t  = tv3.animationDelay;
        var a  = item;
        var dW = a.offsetWidth; 
        var viewWidth  = window.innerWidth;
        var viewHeight = window.innerHeight;
        var sW = viewWidth;
        var sH = viewHeight;
        var dH = sH*dW/sW;
        var el = util.offset(a);
 
        var str = "transition-property: height; top: "+el.top+"px; left:"+el.left+"px;transition-duration:"+t+"s;height:"+parseInt(dH)+"px;width:"+parseInt(dW)+"px";
       
        var ruleClassId = util.generateRule(str);
        util.addClass(a,ruleClassId);
        /* This holds the return value for an operation.. */

        state.recordSubMutation(item, str);

    },

    centerParent: function (item, state) {
        var mutationId = state.id;
        var el = state.queryIncoming()// this may return serialized..
        var viewHeight = item.offsetHeight;
        var height = el.node.offsetHeight;
        try { 
            height = el.height;
        } catch (i) {
        } 

        var dH = (height/2)-(viewHeight/2);

        var str = 'transition-property:margin-top; transition-duration:'+tv3.animationDelay+'s; margin-top:'+parseInt(dH)+'px';        
        item.setAttribute('style',str);
    },

    tilt: function (item,state) {
        var a = item;
        var xDeg = -35+parseInt(Math.random()*70);
        var yDeg = -35+parseInt(Math.random()*70);
        var zDeg = 0;
        var str = 'transition-property:transform; transition-duration:'+tv3.animationDelay+'s; transform: perspective(400px) rotateY('+yDeg+'deg) rotateX('+xDeg+'deg) rotateZ('+zDeg+'deg) '
        ruleClassId = util.generateRule(str)
        util.dumpClass(a,ruleClassId);
    },

    typing: function (item,state) {
        var a = item;
        var storedStr = $(a).text();
        $(a).html();

        var cbFunction = function () { 
            state.endSlide(item)
        }
        var animation = new tv4Typing(storedStr, a, cbFunction)
        animation.run();
        var str = 'display:block'
        ruleClassId = util.generateRule(str);
        util.dumpClass(a,ruleClassId);
    },

    cameraFollow: function (item, st) { 
        
        var mutationId = st.id; 
        var t = tv3.animationDelay;
        var transformElementTranslate = document.body;
        var transformElementScale = transformElementTranslate.parentNode;

        var a = item;
        var x = 0; 
        var y = 0;

        var viewWidth = null;
        var viewHeight= null;

        if(transformElementScale.nodeName=="HTML") { 
            viewWidth = window.innerWidth;
            viewHeight =  window.innerHeight;
        } else { 
            viewWidth = transformElementScale.offsetWidth;
            viewHeight =  transformElementScale.offsetHeight;
        }
        var viewLeft = transformElementScale.clientLeft;
        var viewTop =  transformElementScale.clientTop;

        // This is the actual point of resolution. We need to take
        // into consideration if we are to use "remote" parameters 
        // or real / DOM window parameters. And to explore better 
        // The use cases to understand if this flexible approach
        // makes sense  - i.e. if it can scale.  

        var el = util.offset(a);

        var el2 = st.queryIncoming();

        x= el2.left - viewLeft - parseInt((viewWidth - parseInt(el2.width))/2);  
        y= el2.top- viewTop - parseInt((viewHeight - parseInt(el2.height))/2);  
       // transformElementTranslate.setAttribute("style",);

        var str = "-moz-transition-property: -moz-transform; -moz-transform:translate("+-1*x+"px,"+-1*y+"px); -moz-transition-duration:"+t+"s; -webkit-transition-property: -webkit-transform; -webkit-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -webkit-transition-duration:"+t+"s; -o-transition-property: -o-transform; -o-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -o-transition-duration:"+t+"s;"
 //       ruleClassId = generateRule(str);
//        $(transformElementTranslate).addClass(ruleClassId);
        transformElementTranslate.setAttribute("style",str);

   
        var sW = viewWidth/el2.width;
        var sH = viewHeight/el2.height;

        var sC = 0;

        var x= el.left; 
        var y= el.top;  

        var probeHeight = el2.height*sW;
        
        fullOverlap = false; 

        if(probeHeight<=viewHeight) { 
            if(!fullOverlap) { 
                sC = sW ;
                this.recordScale = el2.width/viewWidth;
            } else {
                sC = sH;
                this.recordScale = el2.height/viewHeight;
            }
        } 
        else { 
            if(!fullOverlap) { 
                sC = sH;
                this.recordScale = el2.height/viewHeight;
            } else {
                sC = sW ;
                this.recordScale = el2.width/viewWidth;
            }
        } 

        var str =   "-moz-transition-property: -moz-transform; -moz-transform-origin:"+parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;; -moz-transition-duration:"+t+"s;-moz-transform:scale("+sC+");";
        str += "-webkit-transition-property: -webkit-transform; -webkit-transform-origin:"+parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;;-webkit-transition-duration:"+t+"s;-webkit-transform:scale("+sC+");";
        str += "-o-transition-property: -o-transform-origin:"   +parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;;; -o-transition-duration:"+t+"s;-o-transform:scale("+sC+");";
        transformElementScale.setAttribute("style",str);

    }
} 

function tv4Typing(str, targetNode, callbackFunction) { 
    this.initStr = str;
    this.currentStr = '';
    this.index = 0;
    this.timer = 100; 
    
    this.target = targetNode;

    this.run = function typingRun() { 
        if(this.currentStr.length<=this.initStr.length) { 
            this.step();
        }
    }
    this.step = function execStep() { 
        if(this.currentStr.length<this.initStr.length) { 
            this.currentStr = this.initStr.substring(0, this.index); 
            this.index++;
            this.target.innerHTML=this.currentStr;
            var that = this;
            setTimeout(function() { that.step() }, this.timer)
        } else { 
            callbackFunction();
        }
    }
}
