const backendUrl = 'http://localhost:8000';

export const LoginServiceData = {
    userName: "",
    userEmail: ""
};

export const loginFormSubmitBackendCall = async (loginFormUserEmail, loginFormUserPassword) => {
    const userLoginDetails = {
        userEmail: loginFormUserEmail,
        userPassword: loginFormUserPassword
    };

    let result;
    await fetch(backendUrl + '/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userLoginDetails),
    }).then((res) => { result = res.json(); }).catch(error => {
        return Promise.reject("User not found please re-try!!");
    } );

    return result;
}

export const signUpFormSubmitBackendCall = async (signUPFormUserName, signUPFormUserEmail, signUPFormUserPassword) => {
    const registerLoginDetails = {
        userName: signUPFormUserName,
        userEmail: signUPFormUserEmail,
        userPassword: signUPFormUserPassword
    };

    let result;


    await fetch(backendUrl + '/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerLoginDetails)
    }).then((res) => { result = res.json() });
    return result;
}