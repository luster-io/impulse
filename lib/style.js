var transformsProperties = ['translate', 'translateX', 'translateY', 'translateZ',
                  'rotate', 'rotateX', 'rotateY', 'rotateZ',
                  'scale', 'scaleX', 'scaleY', 'scaleZ',
                  'skew', 'skewX', 'skewY', 'skewZ']

function style(position, els, styles) {
  var transformsToApply
    , value
    , props = Object.keys(styles)
    , elsLength = els.length
    , propsLength = props.length
    , i, j
    , hidden
    , hiddenEls = styles.__hiddenEls__ = styles.__hiddenEls__ || []

  for(i = 0 ; i < elsLength ; i++) {
    transformsToApply = []
    hidden = (typeof styles.hidden === 'function') ? styles.hidden(position, i) : styles.hidden
    if(hidden) {
      if(!hiddenEls[i]) {
        els[i].style.webkitTransform = 'translateX(-9999px) translateZ(0)'
        hiddenEls[i] = true
      }
    } else {
      hiddenEls[i] = false
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
      if(!transforms.match(/translateZ/)) {
        transforms += ' translateZ(0)'
      }
      els[i].style.webkitTransform = transforms
    }
  }
}

module.exports = style