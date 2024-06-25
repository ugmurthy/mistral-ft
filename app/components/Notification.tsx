import { Link } from '@remix-run/react'

function Notification({title,body, url="", urlText=""}) {
  return (
    <div role="alert" className="alert shadow-lg">
  
  <div>
    <h3 className="font-bold">{title}</h3>
    <div className="p-2 text-xl">{body}</div>
  </div>
   {url!==""? <Link to={url}>{urlText}</Link>:""}
</div>
  )
}

export default Notification