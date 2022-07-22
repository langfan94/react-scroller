import React, { useRef, useEffect } from 'react';
import BezierEasing from 'bezier-easing';
import styles from './index.module.css';

const requestAnimationFrame = window?.requestAnimationFrame
  || window?.mozRequestAnimationFrame
  || window?.webkitRequestAnimationFrame
  || window?.msRequestAnimationFrame;
const cancelAnimationFrame = window?.cancelAnimationFrame
  || window?.mozCancelAnimationFrame;

const Scroll = props => {
  const containRef = useRef();
  const {
    datasets,
    durating,
    bezierEasing = [0.000, 0.000, 0.580, 1.000],
  } = props;
  const datasMap = new Map();
  // 贝塞尔曲线
  // easy-out
  const easing = BezierEasing.apply(null, bezierEasing);

  useEffect(() => {
    let initStamp = 0;
    const totalOffset = datasets.slice(0, datasets.length - 1).reduce((previousValue, currentItem) => {
      const height = datasMap.get(currentItem).getBoundingClientRect()?.height || 0;
      return previousValue + height;
    }, 0);

    function step(timestamp) {
      if (initStamp === 0) {
        initStamp = timestamp;
      };

      const elapsed = (timestamp - initStamp);
      const move = easing(elapsed / durating) * totalOffset;
      const translateY = ~(move) + 1;
      containRef.current.style.transform = `translateY(${translateY}px)`;

      if (elapsed >= durating) {
        cancelAnimationFrame(frameId);
      } else {
        requestAnimationFrame(step);
      }
    }

    const frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [datasets]);


  const getSpanRef = (ref, item) => {
    if (ref) {
      datasMap.set(item, ref);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.contain} ref={ref => containRef.current = ref}>
        {
          datasets.map(item => (
            <span ref={ref => getSpanRef(ref, item)} key={item.key}>{item.label}</span>
          ))
        }
      </div>
    </div>
  );
};

export default Scroll;
