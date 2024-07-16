import jwt from 'jsonwebtoken';
import ms from 'ms';

export function generateToken(payload,expiresIn=ms('1d')) {
    //console.log("generateToken: payload ",payload);
    //console.log("generateToken: expiresIn ",expiresIn);
    const token = jwt.sign({
        ...payload,
        iat: Date.now(),
    }, process.env.JWT_SECRET, {
        expiresIn: expiresIn || ms('1d')
    });
    return token;
}

// given a JWT extract details from it and return null if it is invalid or expired
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("verifyToken: decoded ",decoded, decoded.exp-Date.now());
        //console.log("verifyToken: Expired? ",decoded.exp < Date.now())
        if (decoded?.exp < Date.now()) {
            console.log("verifyToken: Token expired");
            return null;
        }
        console.log("verifyToken: Token verified");
        return decoded;
    } catch (error) {
        return null;
    }
}

// get google user profile and jwt token.
export async function getGoogleProfileAndJWT(request:Request) {
    const formData = await request.formData();
    const access_token = formData.get("access_token");
    //const expires_in = formData.get("expires_in");
    //const scope = formData.get("scope");
    let userdata
    try {
    // fetch profile
    const res = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                }
            })
         userdata = await  res.json();
        } catch (error) {
            console.log("getGoogleProfile: (error) ",error)
            return null;
        }

    console.log("1. getGoogleProfile: Got user profile ")
        if (userdata && userdata.email && userdata.verified_email) {
            const token = await generateToken(userdata);
            console.log("2. getGoogleProfile: Returning access token and user profile ");
            return {
                token: token,
                user: userdata
            }
        } else {
            return null;
        }
}

/// helper function to get user details.
export async function getUserName(user) {
    if (user.name) {
        return user.name;
    } else if (user.given_name && user.family_name) {
        return user.given_name + " " + user.family_name;
    } else if (user.email) {
        return user.email;
    } else {
        return "Anonymous";
    }
}

export async function getUserImage(user) {
    if (user.picture) {
        return user.picture;
    } else {
        return "/avatar.png";
    }
}

export async function getUserEmail(user) {
    if (user.email) {
        return user.email;
    } else {
        return null;
    }
}

