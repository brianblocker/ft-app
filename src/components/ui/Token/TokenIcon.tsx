interface TokenIconProps {
  symbol: string
  url: string
  size?: number
}

//need to handle when the url is empty
export const TokenIcon = ({ symbol, url, size = 32 }: TokenIconProps) => {
  return (
    <img
      src={url}
      alt={symbol}
      width={size}
      height={size}
      className={`rounded-full w-[${size}px] h-[${size}px]`}
    />
  )
}