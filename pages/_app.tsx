import '../styles/globals.scss'
import '@fontsource/lato'
import type { AppProps } from 'next/app'
import SEO from '../components/SEO/SEO'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SEO />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
