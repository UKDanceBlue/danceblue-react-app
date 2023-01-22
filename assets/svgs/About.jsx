import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

const SvgComponent = (props) => (
  <Svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x={0}
    y={0}
    viewBox="0 0 248 343"
    style={{enableBackground: "new 0 0 248 343",}}
    xmlSpace="preserve"
    {...props}
  >
    <Path
      d="M122.41 87.6h11.15c.47.11.94.27 1.42.31 8.06.57 15.84 2.4 23.35 5.33 35.24 13.77 57.1 48.95 53.23 87.11-1.37 13.47-5.59 26.07-13.33 37.2-19.87 28.58-47.32 41-81.89 37.19-12.43-1.37-23.91-5.89-34.31-12.87-20.61-13.85-33.02-33.05-37.06-57.59-.39-2.36-.65-4.74-.97-7.11v-11.15c.26-2.05.48-4.1.78-6.15 1.81-12.37 5.97-23.89 12.96-34.28 13.85-20.6 33.05-32.99 57.58-37.02 2.34-.4 4.72-.66 7.09-.97zm16.08 115.48v-1.93c0-11.37.01-22.73-.01-34.1 0-3.79-2.12-5.95-5.85-5.97-6.61-.03-13.22-.03-19.83 0-3.38.01-5.75 2.17-5.8 5.18-.05 3.05 2.38 5.28 5.83 5.32 1.51.02 3.02 0 4.53 0v31.49c-1.7 0-3.27-.04-4.85.01-3.21.09-5.56 2.37-5.51 5.31.04 2.89 2.33 5.16 5.47 5.17 10.33.05 20.65.04 30.98 0 3.21-.01 5.56-2.35 5.52-5.29-.04-2.89-2.33-5.1-5.46-5.19-1.58-.04-3.16 0-5.02 0zm-.02-62.94c.07-5.62-4.67-10.42-10.39-10.54-5.59-.11-10.42 4.61-10.58 10.35-.16 5.62 4.75 10.6 10.47 10.62 5.65.02 10.43-4.74 10.5-10.43z"
      style={{fill: "#0032A0",}}
    />
  </Svg>
)

export default SvgComponent