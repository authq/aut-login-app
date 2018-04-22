import React from 'react';
import axios from 'axios';

const result = '';
const url = 'https://login.aut.ac.ir';

function checkLoginWithHTML(html) {
    return html.indexOf('<div class="alert alert-info">') !== -1;
}

function checkLogoutWithHTML(html) {
    return html.indexOf('<div class="login-page">') !== -1;
}

export async function doLogin(username, password) {
    const body = `username=${username}&password=${password}`;
    result = await axios.post(url + '/login', body);
    console.log(result)
    const success = checkLoginWithHTML(result.data);
    return success;
}

export async function doLogout() {

    result = await axios.get('https://internet.aut.ac.ir/status/logout/');
    const success = checkLogoutWithHTML(result.data);
    if (success) {
        return false;
    }
    else {
        return true;
    }
}

export async function checkLogin() {
    const islogin = await axios.get('https://internet.aut.ac.ir/');
    const success = checkLoginWithHTML(islogin.data);
    return success;
}