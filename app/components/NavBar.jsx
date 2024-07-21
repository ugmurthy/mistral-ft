import Theme from "./Theme"
import { Link } from "@remix-run/react"
import Avatar from './MenuIcon'
import MenuIcon from "./MenuIcon"

function NavBar() {
  const VERSION = 'V0.13 21Jul24'
  return (
    <div className="navbar bg-base-100">
  <div className="flex-1">
    
    <span className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-700  to-orange-300"><Link to="/">RunGenie</Link></span><span className="pl-4 mt-2 text-xs font-thin text-gray500">{VERSION}</span>
  </div>
  <div className="flex-none gap-2">
    <div className="form-control">
      <Theme />
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        
          <MenuIcon tooltip="Athlete" iconTxt="At" orientation="tooltip-left"></MenuIcon>
        
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <Link to="/about" className="justify-between">
            About
          </Link>
        </li>
        <li><Link to="https://forms.gle/H88rEyZqMDUMD5QPA" target="_blank">Feedback</Link></li>
        <li><Link to="/logout">Logout</Link></li>
        
      </ul>
    </div>
  </div>
</div>
  )
}

export default NavBar


//<a className="btn btn-ghost text-4xl" href="/">My Coach</a>
//<img alt="Avatar" src="/avatar.png" />


/*
<div className="w-10 rounded-full">
          <Avatar tooltip="Athlete" iconTxt="At" orientation="tooltip-left"></Avatar>
        </div>
*/