import './App.css'
import {Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './components/Settings'
import Channel from './components/Channel'
import VideoPlayerPage from './components/VideoPlayerPage'
import MainLayout from './components/MainLayout'
import LikedVideos from './components/LikedVideos'
import WatchHistory from './components/WatchHistory'
import UserPlaylists from './components/UserPlaylists'
import Playlist from './components/Playlist'


function App() {

  return (
    <div className='bg-stone-950 min-h-screen'>

    <Routes>
      {/* Public routes */}


      {/* With navbar routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />}/>
        <Route path="/channel/:username" element={<Channel />} />
        <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
        <Route path='/liked' element={<LikedVideos />} />
        <Route path='/history' element={<WatchHistory />} />
        <Route path="/playlists" element={<UserPlaylists />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />
      </Route>


      {/* Without navbar routes */}
      <Route path="/login" element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>


      {/* Private routes */}
       <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>}/>

      

    </Routes>
    </div>
  )
}

export default App
