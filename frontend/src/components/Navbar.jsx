import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm opacity-90">{user?.username}</span>
        <button
          onClick={logout}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
