import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './components/AuthProvider/AuthProvider'
import Header from './components/Header/Header'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FIS Lunch Manager',
  description: 'Lunch Management App | FlyInfoSoft',

}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='max-w-screen-xl mx-auto'>
      <head>
      <link rel="icon" href="../app/favicon.png" />
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.6.0/dist/full.min.css" rel="stylesheet" type="text/css" />
      </head>

      <body className={inter.className}>
        <AuthProvider>
          <Header></Header>
          {/* <Manage></Manage> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
