import NavBar from "@/components/Navbar";

export default function ShowLogin() {
    return (
        <form >
            <h3>Register Form:</h3>
            
            <label>Email:</label><br />
            <input
                name="email"
                placeholder="example@cnss.ma"
                type="email"
                className="email"
            />
            <br/>

            <label>Password:</label><br />
            <input
                name="password"
                placeholder="example@cnss.ma"
                type="password"
                className="password"
            />
            <br/> <button type="submit">Login</button>
        </form>
    );
}