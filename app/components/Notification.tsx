import { Link } from '@remix-run/react'

function Notification({title,body, url="", urlText=""}) {
  return (
    <div role="alert" className="alert shadow-lg">
  
  <div>
    <h3 className="opacity-70  font-bold">{title}</h3>
    <div className="opacity- 70 p-2 text-sm">{body}</div>
  </div>
   {url!==""? <Link to={url}>{urlText}</Link>:""}
</div>
  )
}

export default Notification