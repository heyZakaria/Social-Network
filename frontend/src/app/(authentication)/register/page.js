import Element from "@/components/Element";

export default function ShowRegister() {
    return <>
        
            <form >
            <h3>Register Form:</h3>
                <label>First Name:</label><br />
                <input
                    name="first_name"
                    placeholder="First Name"
                    type="text"
                    className="first_name"
                />
                <br />

                <label>Last Name:</label><br />
                <input
                    name="last_name"
                    placeholder="Last Name"
                    type="text"
                    className="last_name"
                />
                <br />

                <label>Email:</label><br />
                <input
                    name="email"
                    placeholder="example@cnss.ma"
                    type="email"
                    className="email"
                />
                <br />

                <label>Password:</label><br />
                <input
                    name="password"
                    placeholder="example@cnss.ma"
                    type="password"
                    className="password"
                />
                <br /> <button type="submit">Next</button>
            </form>
        

    </>
}