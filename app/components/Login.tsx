import {GoogleOAuthProvider, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Form} from '@remix-run/react';
import { useEffect, useState ,useRef} from 'react';

export default function Login({gid}){
    //console.log("GID : ",gid);


return (
<GoogleOAuthProvider clientId={gid}>
        <Component/>
</GoogleOAuthProvider>
)

}

function Component() {
    const [codeResponse,setUser] = useState(null);
    const formRef = useRef();
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (codeResponse) {
            console.log("UseEffect Got codeResponse");
            console.log("UseEffect submitting form")
            formRef.current.submit();
        }
    }, [codeResponse]);

    return (
        <div className='p-40'>
        <div className='flex  justify-center '>
        <button className="w-40  border-1 border-2 border-blue-500" onClick={() => login()}>
            <img className="w-full h-auto"  src="/GoogleBtn.png" alt="Google Login"></img>
        </button>
        </div>
    {codeResponse && <div className='p-20'>
        
        <Form ref={formRef}method="post">
            <input type="hidden" name="access_token" value={codeResponse.access_token} />
            <input type="hidden" name="expires_in" value={codeResponse.expires_in} />
            <input type="hidden" name="scope" value={codeResponse.scope} />
        </Form>
    </div>}
    </div>
    )
}


/*
{codeResponse && <div className='p-20'>
        <h3>User Logged in</h3>
        <p>Access Token : {codeResponse.access_token}</p>
        <p>Refresh Token : {codeResponse.refresh_token}</p>
        <p>Expires In : {codeResponse.expires_in}</p>
        <p>Scope : {codeResponse.scope}</p>
        <p>Token Type : {codeResponse.token_type}</p>
        <p>Id Token : {codeResponse.id_token}</p>
        <Form ref={formRef}method="post">
            <input type="hidden" name="access_token" value={codeResponse.access_token} />
            <input type="hidden" name="expires_in" value={codeResponse.expires_in} />
            <input type="hidden" name="scope" value={codeResponse.scope} />
        </Form>
        <button onClick={() => googleLogout()}>Logout</button>
    </div>}
*/