  One of the easiest things to build with luster physics is a pull down menu.
We'll build a pulldown menu that bounces when it hits the bottom, and springs
up when you close it.

  We'll use hammer.js for our events, since makes handling events for touch
interfaces really easy.

  Let's start by creating some markup for our menu.

```
<body>
  <div class="nav-header">
    <div class="hamburger-menu-handle"></div>
  </div>
  <div class="pull-down-menu"></div>
</div>
```

  We have the menu itself `.pull-down-menu`, and then we have a top nav bar
with a hamburger menu icon `.hamburger-menu-handle` (three bars), which when
clicked or dragged, will open and close the menu.

  Add some basic css.

```
.pull-down-menu {
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  margin-top: -100%;
}

```