import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const fbApp = initializeApp({
	credential: applicationDefault(),
});

const fbAuth = getAuth(fbApp)

export {fbApp, fbAuth}
