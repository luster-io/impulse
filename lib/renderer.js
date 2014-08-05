function loop() {
  requestAnimationFrame(function() {
    loop()
    var i
    for(var i = calls.length - 1; i >= 0; i--) {
      calls[i]()
    }
  })
}

loop()

var calls = []

var transformsProperties = ['translate', 'translateX', 'translateY', 'translateZ',
                  'rotate', 'rotateX', 'rotateY', 'rotateZ',
                  'scale', 'scaleX', 'scaleY', 'scaleZ',
                  'skew', 'skewX', 'skewY', 'skewZ']

module.exports = Renderer

function Renderer(els) {
  if(typeof els.length === 'undefined')
    els = [els]
  this.els = els
  this.styles = {}
  this.invisibleEls = []
  calls.push(this.render.bind(this))
}

Renderer.prototype.render = function() {
  if(!this.currentPosition) return
  var transformsToApply
    , els = this.els
    , position = this.currentPosition
    , styles = this.styles
    , value
    , props = Object.keys(styles)
    , elsLength = els.length
    , propsLength = props.length
    , i, j
    , transforms

  for(i = 0 ; i < elsLength ; i++) {
    transformsToApply = []
    if(this.visibleFn && !this.visibleFn(position, i)) {
      if(!this.invisibleEls[i]) {
        els[i].style.webkitTransform = 'translate3d(0, -99999px, 0)'
      }
      this.invisibleEls[i] = true
    } else {
      this.invisibleEls[i] = false
      for (j = 0; j < propsLength; j++) {
        prop = props[j]
        value = (typeof styles[prop] === 'function') ? styles[prop](position, i) : styles[prop]

        if(transformsProperties.indexOf(prop) !== -1) {
          transformsToApply.push(prop + '(' + value + ')')
        } else {
          els[i].style[prop] = value
        }
      }
      transforms = transformsToApply.join(' ')
      transforms += ' translateZ(0)'
      els[i].style.webkitTransform = transforms
    }
  }
}

Renderer.prototype.style = function(property, value) {
  if(typeof property === 'object') {
    for(prop in property) {
      if(property.hasOwnProperty(prop)) {
        this.style(prop, property[prop])
      }
    }
  }
  this.styles[property] = value
  return this
}

Renderer.prototype.visible = function(isVisible) {
  this.visibleFn = isVisible
  return this
}
Renderer.prototype.update = function(position) {
  this.currentPosition = position
}