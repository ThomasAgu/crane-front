import { Oval } from 'react-loader-spinner'

export default function Loader({
  loading,
  width = 20,
  height = 20,
}: {
  loading?: boolean
  width?: number
  height?: number
}) {
  if (!loading) return null;

  return (
    <Oval
      height={height}
      width={width}
      color="#3259E6"
      wrapperStyle={{}}
      wrapperClass=""
      visible={loading}
      ariaLabel="oval-loading"
      secondaryColor="#34363B"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  )
}