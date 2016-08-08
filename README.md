# slide-flow

Small javascript library to showcase "slides" without reloading the current page.

![Render](https://rawgit.com/ConstantinoSchillebeeckx/slide-flow/master/ss.png "ss")

## Usage

First, a slidedeck class must be generated through the use of `SlideDeck(sel, files)`; `sel` is the selector into which the slides should be renedered, and `files` is a list of JSON which contain the slide content.  Once loaded, `show()` can be called on the slide deck in order to show the first slide.  Note that if no slide number is provided to the `show()` function, the first JSON file listed in `files` will be rendered.

Note that slides can reside in subdirectories without any issue.

## Slide data formatting

Slides data is loaded through individual JSON files and should follow the format below:

```json
{
    "title": {
        "html": "Group1 Slide1",
        "tag": "h1"
    },
    "body": {
        "html": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "tag": "p"
    },
    "nav": [{
        "html": "Yes",
        "class": "btn btn-success",
        "tag": "button",
        "navTo": "slides/group2/slide2"
    }, {
        "html": "No",
        "class": "btn pull-right btn-info",
        "tag": "button",
        "navTo": "slides/group1/slide2"
    }],
    "readMore": {
        "title": {
            "html": "More info",
            "tag": "h3",
            "class": "panel-title"
        },
        "body": {
            "html": "<p>Body text for more info.</p><br><img class='img-responsive' src='https://upload.wikimedia.org/wikipedia/commons/d/db/B%C3%A9zier_3_big.gif'></img>",
            "tag": "p"
        },
        "tag": "h2",
        "html": "<span class='glyphicon glyphicon-question-sign' aria-hidden='true'></span>",
        "class": "readMore text-primary"
    }
}
```

**Note:** each slide may contain several navigation elements which can link to other slides, in the example above two buttons are used to navigate.  When referencing other slides *the full path with respect to the html/php page being loaded* must be referenced without the use of the file extention.  In the case above, this is shown as `slides/group1/slide2`.
