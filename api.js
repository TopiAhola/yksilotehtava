'use strict';


const baseUrl = 'https://media2.edu.metropolia.fi/restaurant';


/**
 * Updates user info. User has to be logged in.
 * @param user user object
 * @param token token from login
 * @returns {Promise<any>}
 */
async function updateUser(user, token) {
    const url = '/api/v1/users';

    try {
        let response = await fetch(baseUrl+url, {
            method : "PUT",
            contentType : "application/json",
            headers: {
                authorization : `Bearer ${token}`
            },

            body : JSON.stringify( user )
        });
        console.log(response);

        if (response.status === 200) {
            let responseObject = await response.json();
            console.log(responseObject);
            return {
                message : 'success',
                user : responseObject.data
            };

        } else if (response.status === 401) {
            return { message : 'badLogin' };

        } else {
            return { message : 'error' };
        }


    } catch (error) {
        console.log(error);
        return { message : 'error' };
    }
}

async function getUser(token) {
    const url = '/api/v1/users/token';

    try {
        let response = await fetch(baseUrl+url, {
            method : "GET",
            contentType : "application/json",
            headers: {
                authorization : `Bearer ${token}`
            }
        });
        console.log(response);

        if (response.status === 200) {
            let responseObject = await response.json();
            console.log(responseObject);
            return {
                message : 'success',
                user : responseObject.data
            };

        } else if (response.status === 403) {
            return { message : 'badLogin' };

        } else {
            return { message : 'error' };
        }


    } catch (error) {
        console.log(error);
        return { message : 'error' };
    }

}



async function deleteUser(user, token) {}



async function login(username, password) {
    const url = '/api/v1/auth/login'

    try {
        let response = await fetch(baseUrl+url, {
            method : "POST",
            contentType : "application/json",
            headers: {

            },

            body : JSON.stringify( {
                    "username": username,
                    "password": password
                }
            )
        });
        console.log(response);

        let responseJson = await response.json();
        console.log(responseJson);


    } catch (error) {
        console.log(error);
    }
}

export { updateUser, getUser, login };