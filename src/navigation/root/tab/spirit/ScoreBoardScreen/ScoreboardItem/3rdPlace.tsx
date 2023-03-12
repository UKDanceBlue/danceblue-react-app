import { memo } from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */

const ThirdPlaceMedal = (props: SvgProps) => (
  <Svg
    id="Layer_1"
    x={0}
    y={0}
    viewBox="0 0 248 343"
    {...props}
  >
    <Path
      // @ts-expect-error This works
      style={{ fill: props.color ?? "#0032A0" }}
      d="M129.95 27.54c6.13 1.2 12.38 2 18.38 3.68 14.63 4.09 27.14 11.94 37.66 22.87 11.28 11.73 18.71 25.61 22.13 41.53 3.33 15.46 2.58 30.8-2.56 45.76-7.16 20.84-20.37 36.86-39.56 47.73-15.95 9.03-33.14 12.5-51.39 10.54-21.88-2.35-40.21-11.81-54.95-28.04-11.43-12.57-18.48-27.37-21.1-44.22-2.91-18.69-.14-36.5 8.61-53.24 9.94-19.03 25.01-32.54 44.94-40.57 7.69-3.1 15.7-4.94 23.96-5.66.5-.04.99-.25 1.49-.37 4.13-.01 8.26-.01 12.39-.01zm-6.24 15.69c-39.22.3-70.54 31.48-70.58 70.8-.05 39.01 32.11 70.82 70.93 70.47 38.74-.35 70.25-31.05 70.29-70.56.04-39.66-31.77-70.49-70.64-70.71z"
    />
    <Path
      // @ts-expect-error This works
      style={{ fill: props.color ?? "#0032A0" }}
      d="M61.26 184.25c34.28 31.16 90.23 31.2 124.66-.09 2 4.52 3.97 8.97 5.94 13.43 9.39 21.19 18.79 42.37 28.12 63.59.57 1.29.51 2.85.74 4.29-1.38-.22-2.87-.19-4.14-.69-10.85-4.29-21.66-8.69-32.49-13.04-4.89-1.97-6.58-1.2-8.41 3.73-4.09 11.02-8.19 22.04-12.28 33.06-.15.4-.21.87-.46 1.19-.6.75-1.3 1.44-1.95 2.15-.61-.67-1.45-1.24-1.81-2.02-2.81-6.17-5.53-12.38-8.28-18.58-8.73-19.7-17.45-39.4-26.19-59.1-.3-.67-.66-1.31-1.18-2.35-.62 1.27-1.08 2.14-1.48 3.05-11.16 25.19-22.3 50.4-33.5 75.57-.56 1.26-1.62 2.3-2.44 3.44-.84-1.19-1.97-2.28-2.47-3.6-4.16-10.99-8.21-22.03-12.3-33.05-1.69-4.55-3.54-5.39-8.1-3.56-10.91 4.37-21.82 8.77-32.73 13.16-.32.13-.63.32-.96.36-1.06.13-2.13.2-3.19.3.09-1.12-.12-2.37.31-3.34 11.24-25.53 22.55-51.03 33.86-76.54.21-.48.48-.91.73-1.36zM123.8 51.34c-34.53 0-62.52 27.99-62.52 62.52s27.99 62.52 62.52 62.52 62.52-27.99 62.52-62.52-27.99-62.52-62.52-62.52zm-4.95 111.38c-10.62 0-19.92-3.35-24.58-6.4l3.49-9.89c3.64 2.33 12.07 5.96 20.94 5.96 16.43 0 21.52-10.47 21.38-18.32-.15-13.23-12.07-18.91-24.43-18.91h-7.13v-9.6h7.13c9.31 0 21.09-4.8 21.09-16 0-7.56-4.8-14.25-16.58-14.25-7.56 0-14.83 3.34-18.91 6.25l-3.34-9.31c4.94-3.64 14.54-7.27 24.72-7.27 18.62 0 27.05 11.05 27.05 22.54 0 9.74-5.82 18.03-17.45 22.25v.29c11.63 2.33 21.09 11.05 21.09 24.29 0 15.14-11.78 28.37-34.47 28.37z"
    />
  </Svg>
);

export default memo(ThirdPlaceMedal);
