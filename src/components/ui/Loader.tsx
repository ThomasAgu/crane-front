import { Oval } from 'react-loader-spinner'

export default function Loader({loading}: {loading?: boolean}) {
  return (
    <Oval
      height={20}
      width={20}
      color="#3259E6"
      wrapperStyle={{}}
      wrapperClass=""
      visible={loading}
      ariaLabel='oval-loading'
      secondaryColor="#34363B"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  )
}