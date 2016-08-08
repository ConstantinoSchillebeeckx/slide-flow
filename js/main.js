var moveDistance = window.innerWidth / 2;
var defaultSlide = {
    title: { html: 'Slide title', tag: 'h1' },
    body: { html: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', tag: 'p'},
    nav: [
        { html: "Yes", class:"btn btn-success", tag:"button", navTo:"meow"},
        { html: "No", class:"btn pull-right btn-info", tag:"button", navTto:"moo"}
    ],
    readMore: { 
        title: { html: "More info", tag: "h3", class:'panel-title' }, 
        body: { html: "<p>Body text for more info.</p><br><img class='img-responsive' src='https://upload.wikimedia.org/wikipedia/commons/d/db/B%C3%A9zier_3_big.gif'></img>", tag: "p"},
        tag: "h2", html: '<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>', class: "readMore text-primary"
    },
}
var profile = {}; // this is where we store the users to the various questions for later use
var currentSlide = 0; // current slide ID, where ID is the internal counter; gets updated by the show() method




/* Slide deck class

Generats a class object that represents a slidedeck composed of numerous
slides that link together with navigation buttons.

Each slide will automatically get defined an internal ID (a simple counter
starting at 0).  For navigating between slides, slides should be referenced
by their JSON file name.

Parameter:
----------
- sel : str
        selector in which to render slides
- json : array
         list of JSON files that define the slide attributes


Class attributes:
-----------------
- sel : str
        selector in which slides will be rendered
- json : array
         list of JSON files defining the slides
- fileMap : obj
            {internal id: full-path JSON base filename (without extension) }
- slides : array
           list of parsed JSON file data
*/
function SlideDeck (sel, json) {

    // check attributes
    if (typeof sel === 'undefined') { throw new Error("You must provide a selection within which to render the slide."); }

    // show loading spinner
    jQuery(sel).append('<div class="text-center loading"><i class="fa fa-spinner fa-2x fa-spin text-primary" aria-hidden="true"></i><span> Loading...</span></div>');

    this.sel = sel;
    this.json = json;
    this.fileMap = {}
    slides = []; // array of Slide json dat

    // if no path provided, add a single default slide
    if (!this.json) {
        this.slides[0] = defaultSlide;
    } else if (json instanceof Array) {

        jQuery.ajaxSetup({
            async: false // :(
        });

        // load each JSON
        for (var i = 0; i < json.length; i++) {

            var fileName = json[i].replace('.json',''); // remove JSON file type
            this.fileMap[fileName] = i;

            jQuery.getJSON( json[i], function( data ) {
                slides.push(data);
            });

        }
        this.slides = slides;
    }


    globalSlideDeck = this;  // :(

    // remove spinner
    jQuery(".loading").remove();

}


/* Slide deck method for displaying a slide

Parameters:
-----------
- id : int (optional)
       internal ID for slide to show, if not
       specified, the 0th slide is shown
- pos : not implemented

*/
SlideDeck.prototype.show = function(id, pos) {

    id = typeof id === 'undefined' ? 0: id;

    currentSlide = id;
    dat = this.slides[id];

    if (!dat) { throw new Error("Data doesn't exist for slide " + id); }

    var containerWidth = jQuery(this.sel).width();

    var container = d3.select(this.sel)
        .append("div")
        .attr("id","slide")
        .attr("style", function(d) { 
            if (pos) {
                return 'position:relative; opacity:1; ' + pos + ':' + containerWidth + 'px'; 
            } else {
                return 'position:relative;'; 
            }
        })

    // title
    var titleRow = container.append('div')
        .attr('class','row')
      
    titleRow.append('div')
        .attr('class','col-xs-10')
      .append('tag' in dat.title ? dat.title.tag : 'h1')
        .html(dat.title.html);


    if ('readMore' in dat) {

        // read more icon
        titleRow.append('div')
            .attr('class','col-xs-1 col-sm-offset-1')
          .append(dat.readMore.tag)
            .attr("class",dat.readMore.class)
            .attr("role","button")
            .attr("data-toggle","collapse")
            .attr("href","#readMore")
            .attr("aria-expanded","false")
            .attr("aria-controls","readMore")
            .html(dat.readMore.html)

        // hidden read more panel
        var well = container.append('div')
            .attr('class','collapse')
            .attr('id','readMore')
          .append('div')
            .attr('class','panel panel-default')
          
        well.append('div')
            .attr('class','panel-heading')
          .append(dat.readMore.title.tag)
            .attr('class',dat.readMore.title.class)
            .html(dat.readMore.title.html)
          
        well.append('div')
            .attr('class','panel-body')
          .append(dat.readMore.body.tag)
            .html(dat.readMore.body.html)
    }

    // body
    container.append('tag' in dat.body ? dat.body.tag : 'p')
        .html(dat.body.html);

    var form = container.append('form')
            .attr('onsubmit','return false'); // we don't want the form to actually submit


    // input
    if ('input' in dat) {

        // add a hidden submit button to the form so that we can
        // still do input form validation without submitting
        // http://stackoverflow.com/a/19291066/1153897
        form.append('button')
            .attr('type','submit')
            .attr('id','submit_handle')
            .style('display','none')

        var input = form.append("div")
            .attr("class","row")
            .attr("id","inputRow")
          .append("div")
            .attr("class","col-sm-12")

        for (var i = 0; i < dat.input.length; i++) {

            var item = dat.input[i];

            var el = input.append('input')
                .attr('class', item.class)
                .attr("type", item.type)
                .attr("name", item.name)
                .attr("id","input-" + i);

            jQuery('#input-' + i).prop(item.attributes, true); // set attributes e.g. required, checked
                
            input.append('span')
                .html(item.html);
        }
    }

    // nav buttons
    if ('nav' in dat) {
        var nav = form.append("div")
            .attr("class","row")
            .attr("id","navRow")
          .append("div")
            .attr("class","col-sm-12")

        for (var i = 0; i < dat.nav.length; i++) {

            var item = dat.nav[i];

            nav.append('tag' in item ? item.tag : 'button')
                .attr("class", item.class)
                .attr("id", item.id)
                .attr('type', item.type)
                .attr('name', item.name)
                .attr("onclick","nextSlide('" + item.navTo + "', this)")
                .html(item.html);
        }
    }

        
}




/* Global function for transitioning slides

Parameters:
- navTo : str
          base file name of JSON slide to navigate to
- el : element
       'this' of the button that was clicked
*/
function nextSlide(navTo, el) {

    jQuery('#submit_handle').click(); // needed to check required inputs

    if (jQuery('form')[0].checkValidity()) { // if form is valid

        if (!(currentSlide in profile)) {
            profile[currentSlide] = {}
        }

        // store the input fields data (if available)
        var inputVals = jQuery('form').serializeArray();
        if (inputVals.length) {
            var dat = {};
            jQuery(inputVals).each(function(index, obj){
                dat[obj.name] = obj.value;
            });
            profile[currentSlide]['input'] = dat;
        } 

        // store the clicked button 
        var navName = jQuery(el).attr('name');
        profile[currentSlide]['answer'] = navName;

        // remove current slide and navigate to next one
        jQuery('#slide').remove()
        var id = globalSlideDeck.fileMap[navTo]; // lookup which slide we're going to
        globalSlideDeck.show(id);
    }
}
