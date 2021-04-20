import { Cookies } from "react-cookie";

const apiPrefix = "http://localhost:3000";

function setAuthCookie(token) {
    if (token) {
        const cookies = new Cookies();
        cookies.set('auth-token', token, {maxAge: 180});
    }
}

export default {

    async LoginUser(email, password) {
        const query = `
            mutation loginUser($email: String!, $password: String!) {
                login(email: $email, password: $password)
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {     
                    email: email,
                    password: password
                },
            })
        });

        const decoded = await response.json();
        setAuthCookie(decoded.data.login);
        return decoded.data.login;
    },

    async RegisterUser(username, email, password) {
        const query = `
            mutation registerUser($email: String!, $username: String!, $password: String!) {
                register(email: $email, username: $username, password: $password)
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {     
                    email: email,
                    username: username,
                    password: password
                },
            })
        });
    
        const decoded = await response.json();
        setAuthCookie(decoded.data.register);
        return decoded.data.register;
    },

    async GetCurrent() {
        const query = `
            query getCurrentUser {
                current {
                    id
                    email
                    username
                }
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
            })
        });

        const decoded = await response.json();
        return decoded.data.current;
    }
}