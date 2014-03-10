/////
//// DOM Mutation Manager 
/// (C) Copyright 2014 — Marcio dos Santos Galli 
//


var tv2 = {

     plugins: null, 

     mutationSession : [], 
     
     mutationRecord : { 
        "eventId" : null,
        "when" : null,
        "past" :null,
        "store" : null,
        "proxy" : null,
        "xpathDOMin" : null, "xpathDOMout":null 
     },

     start: function (eventId, selectIn, selectOut, proxyFunctions) {
        // this might need to save prior mutation, .. 
        var stamp = this.stampProvider();
        var elIn = this.get(selectIn);
        var elOut = this.get(selectOut);
        elIn.setAttribute('data-mutation-in',''+eventId);
        elOut.setAttribute('data-mutation-out',''+eventId);
        var refPrior = elIn.getAttribute('data-mutation-out');
        // try catch ..
        var refRecordPrior = this.mutationRecord[refPrior];

        return {"stamp":stamp, "id":eventId, 'inState': refRecordPrior};

     },

     stop: function () { 

     },

     // we will need to disconnect, eventually. 
     //                 observer.disconnect();

     when: function (querySelectorParent, mutationEvent, functionCall) { 
        var target = document.querySelector(querySelectorParent);
        // create an observer instance
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            console.log(mutation.type);
            if(mutation.type === 'attributes') {
                if(mutation.attributeName=='data-mutation-out' && mutation.target.getAttribute('data-mutation-out') === mutationEvent) {
                    functionCall();
                }
            }
          });    
        });
         
        // configuration of the observer:
        var config = { attributes: true, childList: false, characterData: false };
         
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
         
        // later, you can stop observing
        //observer.disconnect();

     },

     stampProvider: function () { 
        return Math.random();
     }, 

     out: function (mutationId) {
         var el = document.querySelectorAll('*[data-mutation-out="'+mutationId+'"]');

         return el; 

     }, 

     in: function (mutationId) {
         var el =  document.querySelectorAll('*[data-mutation-in="'+mutationId+'"]');
         var sP = {             
               store: null, 
               node: el[0], 
               nodes: el
         }
         var outId = sP.node.getAttribute('data-mutation-out');
         try {
            sP.store = this.mutationSession[outId].store
         } catch (i) {}
         return sP;
     }, 

     get: function (refSelector) {
        var el = document.querySelector(refSelector);
        return el; 
     }
     
}

/*
document.body.setAttribute('data-mutation','12');

var a = document.querySelectorAll('*[data-mutation="12"]');

alert(a[0].nodeName);  
*/


tv2.call = { 
 
        // this is not the real node right? This can be a node state 
        // mutationId:in and mutatioId:out are DOM elements...

    setup: function (viewportAttributes) { 

        var dataStyle = " html { overflow:hidden; width:100%; height:100%; } body {padding:0; margin:0} ";
        var inlinestyle = document.createElement('link');
        inlinestyle.setAttribute("rel","stylesheet");
        inlinestyle.setAttribute("href","data:text/css,"+ escape(dataStyle));
        document.getElementsByTagName("head")[0].appendChild(inlinestyle);

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

    cameraFollow: function (st) { 
        
        var mutationId = st.id; 

//this.setup();

        var t = 5;
        // we won't use domIn for now. 
        var transformElementTranslate = tv2.out(mutationId)[0];
        var transformElementScale = transformElementTranslate.parentNode;

        var a = tv2.in(mutationId).node;
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

        var el = this.offset(a);
        var el2 = tv2.in(mutationId);

        x= el2.store.left - viewLeft - parseInt((viewWidth - parseInt(el2.store.width))/2);  
        y= el2.store.top- viewTop - parseInt((viewHeight - parseInt(el2.store.height))/2);  
        transformElementTranslate.setAttribute("style","-moz-transition-property: -moz-transform; -moz-transform:translate("+-1*x+"px,"+-1*y+"px); -moz-transition-duration:"+t+"s; -webkit-transition-property: -webkit-transform; -webkit-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -webkit-transition-duration:"+t+"s; -o-transition-property: -o-transform; -o-transform:translate("+parseInt(-1*x)+"px,"+parseInt(-1*y)+"px); -o-transition-duration:"+t+"s;");

        var sW = viewWidth/el2.store.width;
        var sH = viewHeight/el2.store.height;

        var sC = 0;

        var x= el.left; 
        var y= el.top;  

        var probeHeight = el2.store.height*sW;
        
        fullOverlap = false; 

        if(probeHeight<=viewHeight) { 
            if(!fullOverlap) { 
                sC = sW ;
                this.recordScale = el2.store.width/viewWidth;
            } else {
                sC = sH;
                this.recordScale = el2.store.height/viewHeight;
            }
        } 
        else { 
            if(!fullOverlap) { 
                sC = sH;
                this.recordScale = el2.store.height/viewHeight;
            } else {
                sC = sW ;
                this.recordScale = el2.store.width/viewWidth;
            }

        } 
        var str =   "-moz-transition-property: -moz-transform; -moz-transform-origin:"+parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;; -moz-transition-duration:"+t+"s;-moz-transform:scale("+sC+");";
        str += "-webkit-transition-property: -webkit-transform; -webkit-transform-origin:"+parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;;-webkit-transition-duration:"+t+"s;-webkit-transform:scale("+sC+");";
        str += "-o-transition-property: -o-transform-origin:"   +parseInt(viewWidth/2)+"px "+parseInt(viewHeight/2)+"px;;; -o-transition-duration:"+t+"s;-o-transform:scale("+sC+");";
        transformElementScale.setAttribute("style",str);

    },

    fitWindow: function (state) {
        
        var mutationId = state.id;

        t=5;
        var a = tv2.in(mutationId).node; // this may return serialized..
        var a = tv2.out(mutationId)[0];

        var dW = a.offsetWidth; // need to pull DOM, not the actual screen-based. 
        //var dH = a.offsetHeight;

        viewWidth = window.innerWidth;
        viewHeight =  window.innerHeight;

        var sW = viewWidth;
        var sH = viewHeight;
        var dH =  sH*dW/sW;

        var el = this.offset(a);

        var oldStr =  a.getAttribute('style');

        var str = oldStr+";-webkit-transition-property: height; -webkit-transition-duration:"+t+"s;height:"+parseInt(dH)+"px";
        a.setAttribute('style',str);

        var out = tv2.mutationRecord;
        out.store = {'height':parseInt(dH), 'width': dW, 'top': el.top, 'left': el.left };
        tv2.mutationSession[mutationId] = out;

    }
    /// This is our architectural approach to proxy 


} 
