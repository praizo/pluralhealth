// app/fonts.ts
import localFont from 'next/font/local'

const gilroy = localFont({
  src: [
    {
      path: './fonts/Gilroy-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Heavy.ttf',
      weight: '800',      
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
  display: 'swap',
  preload: true,
})

export default gilroy