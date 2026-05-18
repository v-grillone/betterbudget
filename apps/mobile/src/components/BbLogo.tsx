import Svg, { Circle, Defs, Mask, Path, Rect } from 'react-native-svg'

type Props = { size?: number }

export default function BbLogo({ size = 24 }: Props) {
  const width = (240 / 204) * size
  return (
    <Svg width={width} height={size} viewBox="0 0 240 204">
      <Defs>
        <Mask id="m1">
          <Rect width="240" height="204" fill="white" />
          <Path d="M 22,10 H 32 L 67,194 H 57 Z" fill="black" />
        </Mask>
        <Mask id="m2">
          <Rect width="240" height="204" fill="white" />
          <Path d="M 121,10 H 131 L 166,194 H 156 Z" fill="black" />
        </Mask>
      </Defs>
      <Path d="M 22,10 H 32 L 67,194 H 57 Z" fill="#57534e" />
      <Path d="M 121,10 H 131 L 166,194 H 156 Z" fill="#57534e" />
      <Circle cx="80" cy="136" r="44" fill="none" stroke="#57534e" strokeWidth="10" mask="url(#m1)" />
      <Circle cx="179" cy="136" r="44" fill="none" stroke="#57534e" strokeWidth="10" mask="url(#m2)" />
    </Svg>
  )
}
