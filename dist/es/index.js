import React, { useRef, useEffect } from 'react';

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

var src = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".index-module_wrap__0pnSQ{height:20px;overflow:hidden;position:relative;width:100%}.index-module_contain__0sN39{align-items:center;display:flex;flex-direction:column;justify-content:center;left:0;position:absolute;top:0}";
var styles = {"wrap":"index-module_wrap__0pnSQ","contain":"index-module_contain__0sN39"};
styleInject(css_248z);

var requestAnimationFrame = (window === null || window === void 0 ? void 0 : window.requestAnimationFrame) || (window === null || window === void 0 ? void 0 : window.mozRequestAnimationFrame) || (window === null || window === void 0 ? void 0 : window.webkitRequestAnimationFrame) || (window === null || window === void 0 ? void 0 : window.msRequestAnimationFrame);
var cancelAnimationFrame = (window === null || window === void 0 ? void 0 : window.cancelAnimationFrame) || (window === null || window === void 0 ? void 0 : window.mozCancelAnimationFrame);
var Scroll = function(props) {
    var containRef = useRef();
    var datasets = props.datasets, durating = props.durating, _bezierEasing = props.bezierEasing, bezierEasing = _bezierEasing === void 0 ? [
        0.000,
        0.000,
        0.580,
        1.000
    ] : _bezierEasing;
    var datasMap = new Map();
    // 贝塞尔曲线
    // easy-out
    var easing = src.apply(null, bezierEasing);
    useEffect(function() {
        var initStamp = 0;
        var totalOffset = datasets.slice(0, datasets.length - 1).reduce(function(previousValue, currentItem) {
            var ref;
            var height = ((ref = datasMap.get(currentItem).getBoundingClientRect()) === null || ref === void 0 ? void 0 : ref.height) || 0;
            return previousValue + height;
        }, 0);
        function step(timestamp) {
            if (initStamp === 0) {
                initStamp = timestamp;
            }
            var elapsed = timestamp - initStamp;
            var move = easing(elapsed / durating) * totalOffset;
            var translateY = ~move + 1;
            if (containRef.current) {
                // @ts-ignore
                containRef.current.style.transform = "translateY(".concat(translateY, "px)");
            }
            if (elapsed >= durating) {
                cancelAnimationFrame(frameId);
            } else {
                requestAnimationFrame(step);
            }
        }
        var frameId = requestAnimationFrame(step);
        return function() {
            cancelAnimationFrame(frameId);
        };
    }, [
        datasets
    ]);
    var getSpanRef = function(ref, item) {
        if (ref) {
            datasMap.set(item, ref);
        }
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: styles.wrap
    }, /*#__PURE__*/ React.createElement("div", {
        className: styles.contain,
        ref: function(ref) {
            return containRef.current = ref;
        }
    }, datasets.map(function(item) {
        return /*#__PURE__*/ React.createElement("span", {
            ref: function(ref) {
                return getSpanRef(ref, item);
            },
            key: item.key
        }, item.label);
    })));
};

export { Scroll as default };
