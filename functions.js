import {getUser} from "./api/api.js";


const handleAutoLogin = async () => {
    try {

        //get token from local storage
        const token = localStorage.getItem("token");

        //if token exists, get user data from API
        if(token){
            const userByToken = await getUser(token);

            //set user to state
            if (userByToken) {
                setUser(userByToken);
            }

        } else {
            console.log('No token');
        }

        //navigate to
        console.log('Naviage to: '+location.pathname);
        navigate(location.pathname);

    } catch (e) {
        console.log(e.message);
    }
};

export {handleAutoLogin}
