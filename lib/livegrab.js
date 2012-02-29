
  var timeSlide = 3;

  $(document).ready( function () { 
	grabOn(); 

  });

  function grabOn() { 
  	window.onkeydown = function (e) { 

   if(e.keyCode == 81) { 

   var selObj = window.getSelection();   
   //selObj.anchorNode.setAttribute("style","border: 1px solid red");  

   var ww = selObj.getRangeAt(0).getBoundingClientRect().width;
   var hh = selObj.getRangeAt(0).getBoundingClientRect().height;
   var ll = selObj.getRangeAt(0).getBoundingClientRect().left;
   var tt = selObj.getRangeAt(0).getBoundingClientRect().top;

   var wy =window.scrollY;
   var wx =window.scrollX;
   var elX = parseInt(wx + ll);
   var elY = parseInt(wy + tt);
   var pHeight = document.body.clientHeight;
   var pWidth = document.body.clientWidth;
   var b=10;

	var list = Math.random();
	var elAnimation = '<div id="meta_'+list+'" data-target="el_'+list+'" data-time="'+timeSlide+'s" data-effect="scalefit" data-duration="4s">qqq</div>';
	$('body').append(elAnimation);

	$('body').append('<div id="el_'+list+'" class="slide" style="position:absolute;top:'+parseInt(elY-b)+'px;left:'+parseInt(elX-b)+'px;width:'+parseInt(ww+b*2)+'px;height:'+parseInt(hh+b*2)+'px;"></div>');

        timeSlide +=5;
	tv.addElement(document.getElementById("meta_"+list));

 	} 

   if(e.keyCode == 87) { 
	tv.play();
   } 
   } 
 
  } 


