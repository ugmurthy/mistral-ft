import Notification from './Notification'
function Disclaimer() {
  const body = "`MyCoach` is an AI-powered application designed to provide guidance and support. While we strive for accuracy and helpfulness, please be aware that the responses generated by `MyCoach` are not a substitute for professional advice. Always exercise caution and use your own judgment when interpreting and applying any information received from the app. The creators of My Coach are not liable for any decisions or actions taken based on the app's responses.By using this app, you agree to these terms and acknowledge the potential limitations of AI-generated advice."
  const title = "Disclaimer for My Coach App"
  return (
    <Notification title={title} body={body} url={"/askm"} urlText="AskCoach"></Notification>
  )
}
export default Disclaimer;
