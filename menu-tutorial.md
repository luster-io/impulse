  One of the easiest things to build with luster physics is a pull down menu.
We'll build a pulldown menu that accelerates as if it were reacting to gravity
and bounces when it hits the bottom. When it's closing it will spring.

  We'll use hammer.js since this isn't a post about handling touch and mouse
events cross browser, platform or device.  And we'll use jquery, because who
doesn't use jquery?

  Let's start by creating some markup for our menu.

```
<body>
  <div class="nav-header">
    <div class="hamburger-menu-handle"></div>
  </div>
  <div class="pull-down-menu">
    <div class="close-handle">close</div>
  </div>
</div>
```

  We have the menu itself `.pull-down-menu`, and then we have a top nav bar
`.nav-header` with a hamburger menu icon `.hamburger-menu-handle` (three
bars), which when clicked or dragged, will open and close the menu.

  Add some basic css.  To keep this post reasonable I'm not going to explain
everything about the css.  The important thing is that it creates a menu that
is the full height and width of the viewport, and moves it off screen, above
the viewport.

  Lets start by turning the menu into a physics body, whose translateY css
transform will be animated as the animations are run.

```
var menuEl = $('.pull-down-menu')

var menu = new Physics(menu)
  .style('translateY', function(position) { return position.y + 'px' })
```

  What this does is, as the position of the menu changes, (it's being dragged,
accelerated or sprung), we update the css `transform: translateY`, to the
current y position from the animation.

  The first interaction we want to handle is the user tapping the hamburger icon.
this should cause the menu to toggle open or closed.

  First lets make some simple functions for opening and closing our menu.

```
function open(velocity) {
  var animation = menu.accelerate({
    acceleration: 1500,
    bounceAcceleration: 4000,
    bounce: true
  }).to(0, height)
}

function close() {
  return menu.spring({
    tension: 100,
    damping: 15
  }).to(0, 0).start()
}
```

  Most of the options (tension, damping, acceleration, etc) are values that I
found by playing around with the numbers until I found something that felt
good.  It's important that you do that yourself, so that the feel of your
interactions fit with your app.

  Now, in order to trigger those functions, we'll create a click event
listener.

PROTIP: If you're getting a delay between when you tap, and when this
event gets fired, I'd recommend using the fastClick library.

```
var menuHandle = $('.hamburger-menu-handle')
  , menuIsOpen = false

menuHandle.on("click", function() {
  if(menuIsOpen)
    close()
  else
    open()
})
```

Pretty simple, and if you try this code out, the menu should fall open when you click it the
first time, and spring closed the second.

