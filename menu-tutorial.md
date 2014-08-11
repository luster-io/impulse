  One of the easiest things to build with luster physics is a pull down menu.
We'll build a pulldown menu that accelerates as if it were being pulled down
by gravity and bounces when it hits the bottom. When it's closing it will
act as if it's being pulled up by a spring.

  Let's start by creating some markup for our menu.

```html
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

  Lets start by getting the touch event handling boilerplate out of the way.
How to properly handle gestures is out of the scope of this tutorial, so I'm
just going to start out with some simple, easy to understand boilerplate
to handle both touch and mouse events.

https://gist.github.com/xcoderzach/99306bdf26d60cfbf71d

  There is a ton more you can do to ensure that your properly detecting a gestures
intent.  I would recomend checking out hammer.js.

But now, on to the physics animations. In the constructor, we'll create a physics
animation for the menu.

```javascript
  this.menu = new Physics(menu)
    .style('translateY', function(position) { return position.y + 'px' })
}
```

  What this does is, as the position of the menu changes, (being dragged,
accelerated, or sprung), we update the css `transform: translateY` property, to the
current y position.

```javascript
  this.boundry = Physics.Boundry({ top: 0, bottom: window.innerHeight })
  this.interaction = this.menu.interact({ boundry: this.boundry })
  this.interaction.start(event)
```

  This interaction will allow the user to drag the menu between the top of the
window and the bottom.  The boundry is necessary to prevent the user from
dragging the menu past the bottom of the screen.

  Now when a `move` event happens, we update the interaction with the current
event.

```javascript
  this.interaction.update(event)
```

  In the background, Luster Physics takes the eevent and uses it to  render
and calculate the velocity of the user's movement.

  Once we're done we end the interaction, so that a final velocity calculation
is produced.

```javascript
  this.interaction.end()
```

  If you run this code right now, you can pull the menu open by dragging
the hambuger menu, but once you let go it just sticks.  The next step is
to create an animation that flows from the user's movement.

  Like I said earlier, we want to acclerate down and bounce when opened, and
spring back up when closed. `menu.direction('down')` will return `true` if the
object is moving down.  So we just use an `if` to either accelerate or spring.

```javascript
  this.isOpen = this.menu.direction('down')
  if(this.isOpen) {
    this.menu.accelerate({ acceleration: 2500, bounce: true })
      .to(0, this.boundry.bottom).start()
  } else {
    this.menu.spring({ tension: 100, damping: 15 })
      .to(0, this.boundry.top).start()
  }
```

  Most of the options (tension, damping, acceleration, etc) are values that I
found by playing around with the numbers until I found something that felt
good.  It's important that you do that yourself, so that the feel of your
interactions fit with your app.

  Now the last thing we need to do is make sure the menu toggles open when
tapped.  To do that we'll just check if the user started a touch interaction
without moving, you could also use a click event, however some mobile devices
have a ~300ms delay between when the user clicks and when the event fires.

  Esentially if the user just tapped, we'll just toggle the isOpen property.

```javascript
  if(this.moved)
    this.isOpen = this.menu.direction('down')
  else
    this.isOpen = !this.isOpen
```

  So now we should have working pull down menu with a nice bounce.

  You can access the full code here.