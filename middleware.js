// Custom middleware example: redirect to /about from /account or /cabins.
// import { NextResponse } from "next/server";

// export function middleware( request ) {
    // return NextResponse.redirect(new URL("/about", request.url));
// }

// export const config = {
    // matcher: ["/account", "/cabins"],
// };


// Use Auth.js's auth function as middleware.
import {auth} from "./app/_lib/auth";

export const middleware = auth;

// Protect /account page
 export const config = {
     matcher: ["/account"],
 };
