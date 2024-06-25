
import Notification from "~/components/Notification"
function About() {
const body = "'My Coach' is the AI-powered app that puts expert running knowledge in your pocket. Whether you're training for your first marathon or looking to improve your ultramarathon time, get personalized answers and guidance on everything from training schedules to fueling strategies."
  return (
    <div className="p-32">
        <Notification title={"About My Coach"} body={body} url={"/askm"} urlText="Back"></Notification>
    </div>
  )
}

export default About