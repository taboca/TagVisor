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
* decision by deleting the provisions above and replace them with the notice
* and other provisions required by the GPL or the LGPL. If you do not delete
* the provisions above, a recipient may use your version of this file under
* the terms of any one of the MPL, the GPL or the LGPL.
*
* ***** END LICENSE BLOCK ***** */

	function reload() { 
		document.location= document.location;
	} 

 	var rulesCounter=0;
        var scaleold=null;
        var scale=null;
	var timer = null;

	function animateNext(id,t) { 
		var a = document.getElementById(id);
		rulesCounter+=2;
		var x= a.offsetLeft; 	
		var y= a.offsetTop; 	
		var ww = a.offsetWidth;
		var www = window.innerWidth;		        
                var scale = www/(ww+800);
		document.styleSheets[0].insertRule(".wholearea {  -moz-transition-property: -moz-transform; -moz-transform:scale("+scale+"); -moz-transition-duration:3s;  -webkit-transition-property: -webkit-transform; -webkit-transform:scale("+scale+"); -webkit-transition-duration:3s;  -o-transition-property: -o-transform; -o-transform:scale("+scale+"); -o-transition-duration:3s;}",rulesCounter+1);
console.log("escala: " + scale);
		scaleold = scale; 
		x-=0;
                document.styleSheets[0].insertRule(".page { -moz-transition-property: -moz-transform; -moz-transform:translate("+-1*x+","+-1*y+"); -moz-transition-duration:"+t+"s; -webkit-transition-property: -webkit-transform; -webkit-transform:translate("+-1*x+","+-1*y+"); -webkit-transition-duration:"+t+"s; -o-transition-property: -o-transform; -o-transform:translate("+-1*x+","+-1*y+"); -o-transition-duration:"+t+"s;   }",rulesCounter); 
	
	} 

