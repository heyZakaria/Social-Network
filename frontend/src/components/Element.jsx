import Link from "next/link";

export default function NavBar(params) {
    return <>
        <nav>
            <div className="logo">
                <Link href="/"><h1>Network</h1></Link>
            </div>
            <div className="NavbarLinks">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            </div>

        </nav>
    </>
}