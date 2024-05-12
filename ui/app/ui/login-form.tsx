import { signIn } from "@/auth";

export default async function LoginForm() {
    return (
        <form action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
        }}>
            <div>
                <label htmlFor="identifier">Name:</label>
                <input type="text" id="identifier" placeholder="Enter your name" />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="********" />
            </div>
            <button>Submit</button>
        </form>
    );
}