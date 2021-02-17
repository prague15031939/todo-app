const apiPrefix = "http://localhost:3000";

export default {

    async LoginUser(email, password) {
        const response = await fetch(`${apiPrefix}/api/user/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });
        
        return { 
            ok: response.ok,
            status: response.status,
            text: await response.text(),
        };
    },

    async RegisterUser(username, email, password) {
        const response = await fetch(`${apiPrefix}/api/user/register`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        });
        
        return { 
            ok: response.ok,
            status: response.status,
            text: await response.text(),
        };
    },

    async GetCurrent() {
        const response = await fetch(`${apiPrefix}/api/user/current`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });
        
        if (response.ok === true) {
            return await response.json();
        }
    },

}