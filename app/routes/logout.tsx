import { logout } from "~/module/sessions.server";

export async function loader({request}) {
    
    return logout(request);
}
