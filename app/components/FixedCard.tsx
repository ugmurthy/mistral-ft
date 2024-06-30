import {Link} from "@remix-run/react"
function FixedCard({ title, content,url }) {
  return (
    <Link to={url}>
    <div 
      className=" opacity-50 hover:opacity-90 p-2 flex flex-col w-80 h-24 border rounded-md shadow-md overflow-hidden" 
      
    >
      <div className=" bg-gray-100 text-sm font-semibold" data-tip={content}>
        {title}
      </div>

      <div className="p-1 flex-grow overflow-auto"> 
      <div className=" text-sm whitespace-normal break-words ">  
        {content}
        </div>
      </div>
    </div>
    </Link>
  );
}

export default FixedCard;
