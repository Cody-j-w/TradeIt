import { signIn } from "@/auth"
export default function Page() {
    return (
        <div>
            Everything seems to be working
            <form
                action={async () => {
                    "use server"
                    await signIn("auth0");
                }}>
                <button type="submit">Sign in with Auth0</button>
            </form>
        </div>
    )
}