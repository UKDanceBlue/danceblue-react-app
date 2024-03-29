import Svg, { Path, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */

const Clock = ({
  svgProps, color
}: { svgProps?: SvgProps; color?: string }) => (
  <Svg
    id="Layer_1"
    x={0}
    y={0}
    viewBox="0 0 248 343"
    {...svgProps}
  >
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#0032A0" }}
      d="M222 180.75v-5.01c-1.03-.96-1.19-1.94-.1-2.97.13-4.86-.73-9.62-1.64-14.36-9.84-51.36-59.99-87.47-114.57-76.83-49.72 9.69-88.03 58.75-76.37 115.29 10.99 53.29 62.79 87.05 115.86 75.49 30.44-6.63 52.8-24.43 66.97-52.25 5.81-11.4 9.09-23.57 9.75-36.39-1.08-1.03-.92-2.01.1-2.97zm-54.01 14.8c-1.13.2-2.32.15-3.48.15-12.48.01-24.97 0-37.45 0-.83 0-1.67.03-2.5-.04-3.66-.33-6.15-2.76-6.49-6.37-.11-1.16-.05-2.33-.05-3.49v-62.42c0-1.17-.06-2.34.03-3.49.3-3.73 2.86-6.23 6.41-6.36 3.65-.13 6.34 2.1 6.83 5.83.21 1.64.17 3.32.17 4.98.01 16.98.01 33.96.01 50.94 0 1.17-.02 2.33.01 3.5.07 3.19.16 3.33 3.43 3.34 9.49.03 18.98 0 28.46.03 1.66.01 3.35.02 4.96.35 3.14.64 5.24 3.31 5.31 6.4.06 3.11-2.37 6.06-5.65 6.65z"
    />
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#0032A0" }}
      d="M221.9 172.77v10.96l-2.31-2.32V174z" />
  </Svg>
);

export default Clock;
