import {signInAction} from "../_lib/actions";

function SignInButton() {
    // Authentication is handled server-side. Therefore, this is a server component.
    // But we can't have interactivity in a server component. So we will use a Server Action.
    return (
        <form action={signInAction}>
            <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
                <img
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google logo"
                    height="24"
                    width="24"
                />
                <span>Continue with Google</span>
            </button>
        </form>
    );
}

export default SignInButton;
