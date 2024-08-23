import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {createGuest, getGuest} from "./data-service";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({auth, request}) {
            // Returns true if user is authorized, and false if not.
            // auth is the current session.
            return !!(auth?.user);
        },
        // Async because we are awaiting things.
        async signIn({user, account, profile}) {
            // Runs right after the user has signed in, but before anything else happens.
            // Returns true/false depending on if everything went well or not.
            try {
                // The idea is very simple.
                // If there is a guest, we connect this account with the guest.
                // If not we create a new guest in the database with these credentials.
                const existingGuest = await getGuest(user.email);

                if (!existingGuest) {
                    // Create new guest.
                    await createGuest({email: user.email, fullName: user.name})
                }

                return true;
            } catch(e) {
                return false;
            }
        },
        // Called every time the session is checked out, and after signin callback.
        // This has to be done after sign in because session is not yet created at that point.
        async session({session, user}) {
            const guest = await getGuest(session.user.email);
            // Set the session's user's guestId so that this will be available everywhere.
            session.user.guestId = guest.id;

            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(authConfig);
