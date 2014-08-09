Luster Physics is a library that allows you to create high performance
physics based animations in javascript.

How is this different from jquery animate, velocity.js, etc?
---------------------------------------------------------

  Most animation libraries animate from one state to another over a fixed
period of time.  If you want non-linear movement you pass in an easing
function, which modifies the original path in the same way every time.

  Luster Physics takes a different approach.  Instead of a start, end, and
duration, LP instead takes a start, end, and velocity.  This small change
produces a vastly difference experience.

  Animations can now flow smoothly from user interactions.  When a user swipes
a page, it moves at the velocity they flicked it at.  When they scroll, the
page moves at their velocity, slowly coming to rest.

How is this different from famo.us?
-----------------------------------

  Famo.us is a huge framework that tries to do everything for you. It tries to
do away with the browser's layout engine, in favor of converting
everything into a hardware accelerated render layer and controlling
everything itself.

  Luster Physics is a small library that provides physics based animations and
nothing else.  It works with web standards, instead of trying to reinvent the
browser's layout engine.