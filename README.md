# csgo-demo-bombsite-boundary-extractor
Extracts coordinates of bombsites from Counter-Strike: Global Offensive demos. Designed for use with [drweissbrot/csgo-hud](https://github.com/drweissbrot/csgo-hud).

## Usage
Clone and install dependencies via Yarn.

Then, get a CS:GO demo and run
```sh
node app.js /path/to/demo.dem
```

This will result in something like this
```js
de_overpass: {
  a: [
    { x: -2136, y: 662, z: 502 },
    { x: -2601, y: 351, z: 471 },
    { x: -1671, y: 973, z: 533 }
  ],
  b: [
    { x: -1104, y: 64, z: 104 },
    { x: -1249, y: -97, z: 79 },
    { x: -959, y: 225, z: 129 }
  ]
}
```

The coordinates are (in order): the center of the bombsite, the minimum, and the maximum vectors.
Note that on some maps there may be valid planting positions outside of the minimum and maximum vectors.

If used for [csgo-hud](https://github.com/drweissbrot/csgo-hud), you can paste the output (almost) verbatim into [src/renderer/bombsites.js](https://github.com/drweissbrot/csgo-hud/blob/master/src/renderer/bombsites.js).
