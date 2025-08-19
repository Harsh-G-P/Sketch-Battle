import React, { useEffect } from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home'
import Auth from './pages/Auth'
import Draw from './pages/Draw'

import { useAuthStore } from './store/useAuthStore'

import Header from './Components/Header'
import Battle_lobby from './pages/Battle_lobby'
import BattlePage from './pages/BattlePage'
import BattleResultPage from './pages/BattleResultPage'
import GalleryPage from './pages/GalleryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import WaitingPage from './pages/WaitingPage'
import VotePage from './pages/VotePage'

const App = () => {

  const {checkAuth,authUser,checkingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(checkingAuth){
    return null
  }
  

  return (
     <div className='absolute inset-o -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,
    transparent_1px), linear-gradient(to_bottom, #f0f0f0_1px, transparent_1px)] bg-[size:6rem_4rem]'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={!authUser ? <Auth /> : <Navigate to={'/'} />} />
        <Route path='/draw' element={authUser ? <Draw /> : <Navigate to={'/auth'} /> } />
        <Route path='/battle-lobby' element={authUser ? <Battle_lobby /> : <Navigate to={'/auth'} /> } />
        <Route path='/battle/:battleId' element={authUser ? <BattlePage /> : <Navigate to={'/auth'} /> } />
        <Route path='/waiting/:battleId' element={authUser ? <WaitingPage /> : <Navigate to={'/auth'} /> } />
        <Route path='/battle-result' element={authUser ? <BattleResultPage /> : <Navigate to={'/auth'} /> } />
        <Route path='/gallery' element={authUser ? <GalleryPage /> : <Navigate to={'/auth'} /> } />
        <Route path='/leaderboard' element={authUser ? <LeaderboardPage/> : <Navigate to={'/auth'} /> } />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/auth'} /> } />
        <Route path='/vote/:battleId' element={authUser ? <VotePage /> : <Navigate to={'/auth'} /> } />
      </Routes>
      <ToastContainer />
      <Toaster />
    </div>
  )
}

export default App