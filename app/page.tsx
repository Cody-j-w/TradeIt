import { signIn } from "@/auth"
import { userInformation } from "@/lib/data";
export default async function Page() {
    const session = await userInformation()
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
            <img src={session?.user?.image!!} />
        </div>
    )
}