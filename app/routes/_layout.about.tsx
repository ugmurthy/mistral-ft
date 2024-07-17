
import Notification from "~/components/Notification"
function About() {
const body = "'RunGenie' is the AI-powered app that puts expert running knowledge in your pocket. Whether you're training for your first marathon or looking to improve your ultramarathon time, get personalised answers and guidance on everything from training schedules to fueling strategies."
  return (
    <div className="p-32">
        <Notification title={"About RunGenie"} body={body} url={"/"} urlText="Back"></Notification>
    </div>
  )
}

export default About