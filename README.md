## TagVisor.js — 10K code that Enhances a Web Page to Become Couch-o-Matic mode ( time-based and other event-based animation with HTML5 effects ) 

[Check live demos here](http://taboca.github.com/TagVisor).

## Example of how the animation is described: 

Imagine a web page with html body and so on. You will need to add tagvisor.js, to put a chunk of markup as the following and make sure you have a div named 'slide1'. For the actual full source code see the ./tests directory.

    <ul id='animation'>
      <li data-target='slide1' data-time="2s" data-effect="scalefit" data-duration="3s" />
    </ul>

## Is this project part of what? What is the goal? 

This project is an exercise, and a tool, and it is part of a cause. We want to explore if a web page can have multiple views and how users can tell ( annotate ) their views about web pages. This work also wants to explore how annotated experiences can enhance web pages so it becomes easier to visualize and learn web page content in different ways. Perhaps web pages can become also frameworks for learning and for interaction. Perhaps we can also stumble in unexpected learnings here. In order to explore this we want to use some principles ( these are not strict but some current guide and motivation): 

* Keep the markup almost intact, the best we can 
* Annotation to the page should be a sort of separated chunk of data, and not be mixed in the markup. 
* Perhaps the animated views can be even stored as a link from the document page and not inside the page itself. 
* More? 

## LICENSE

All files that are part of this project are covered by the following
license, except where explicitly noted.

    Version: MPL 1.1/GPL 2.0/LGPL 2.1

    The contents of this file are subject to the Mozilla Public License Version
    1.1 (the "License"); you may not use this file except in compliance with
    the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS" basis,
    WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
    for the specific language governing rights and limitations under the
    License.

    The Original Code is Taboca TelaSocial / TagVisor

    The Initial Developer of the Original Code is Taboca Labs.

    Portions created by the Initial Developer are Copyright (C) 2010
    the Initial Developer. All Rights Reserved.

    Contributor(s):
 	
    Marcio Galli <mgalli@mgalli.com>

    Alternatively, the contents of this file may be used under the terms of
    either the GNU General Public License Version 2 or later (the "GPL"), or
    the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
    in which case the provisions of the GPL or the LGPL are applicable instead
    of those above. If you wish to allow use of your version of this file only
    under the terms of either the GPL or the LGPL, and not to allow others to
    use your version of this file under the terms of the MPL, indicate your
    decision by deleting the provisions above and replace them with the notice
    and other provisions required by the GPL or the LGPL. If you do not delete
    the provisions above, a recipient may use your version of this file under
    the terms of any one of the MPL, the GPL or the LGPL.
