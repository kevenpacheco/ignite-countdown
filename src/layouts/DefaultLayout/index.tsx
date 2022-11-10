import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutCotainer } from './styles'

export function DefaultLayout() {
  return (
    <LayoutCotainer>
      <Header />
      <Outlet />
    </LayoutCotainer>
  )
}
