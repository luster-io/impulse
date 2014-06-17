var transformsProperties = ['translate', 'translateX', 'translateY', 'translateZ',
                  'rotate', 'rotateX', 'rotateY', 'rotateZ',
                  'scale', 'scaleX', 'scaleY', 'scaleZ',
                  'skew', 'skewX', 'skewY', 'skewZ']

function style(position, els, styles) {
  var transformsToApply
    , value
  for(var i = 0 ; i < els.length ; i++) {
    transformsToApply = []
    for(prop in styles) {
      if(styles.hasOwnProperty(prop)) {
        value = (typeof styles[prop] === 'function') ? styles[prop](position, i) : styles[prop]
        if(transformsProperties.indexOf(prop) !== -1) {
          transformsToApply.push(prop + '(' + value + ')')
        } else {
          els[i].style[prop] = value
        }
      }
    }
    var transforms = transformsToApply.join(' ')
    if(!transforms.match(/translateZ/)) {
      transforms += ' translateZ(0)'
    }
    els[i].style.webkitTransform = transforms
  }
}

module.exports = style