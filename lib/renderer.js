function loop() {
  requestAnimationFrame(function() {
    loop()
    calls.forEach(function(fn) {
      fn()
    })
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
  this.els = els
  this.styles = {}
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

  for(i = 0 ; i < elsLength ; i++) {
    transformsToApply = []
    for (j = 0; j < propsLength; j++) {
      prop = props[j]
      value = (typeof styles[prop] === 'function') ? styles[prop](position, i) : styles[prop]
      if(transformsProperties.indexOf(prop) !== -1) {
        transformsToApply.push(prop + '(' + value + ')')
      } else {
        els[i].style[prop] = value
      }
    }
    var transforms = transformsToApply.join(' ')
    if(!transforms.match(/translate(Z|3d)/)) {
      transforms += ' translateZ(0)'
    }
    els[i].style.webkitTransform = transforms
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

Renderer.prototype.update = function(position) {
  this.currentPosition = position
}
