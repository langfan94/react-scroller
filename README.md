react component

USAGE:
```js
import ReactScroll from 'ReactScroll';
const datasets = [
  {
    label: '1',
    key: 1,
  },
  {
    label: '2',
    key: 2,
  },
  {
    label: '3',
    key: 3,
  },
  {
    label: '4',
    key: 4,
  },
  {
    label: '5',
    key: 5,
  },
];

const durating = 1000; // default 1000ms


<ReactScroll datasets={datasets} durating={2000} bezierEasing={[0.000, 0.600, 0.580, 1.000]} />
```