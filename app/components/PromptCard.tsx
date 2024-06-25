//
// inspired by chatGPT
//
import { Link } from '@remix-run/react'

function PromptCard({url,cardTitle,cardText}) {
  return (
    <Link to={url}>
<div className="m-4 card bg-gray-100 w-96 shadow-xl">
  <div className="card-body text-gray-500">
    <h2 className="card-title">{cardTitle}</h2>
    <p>{cardText}</p>
  </div>
</div>
</Link>
  )
}

export default PromptCard