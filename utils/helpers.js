exports.parseCookies = (cookies) => {
    const obj = {};
    cookies.split(";").map((cookie) => {
        const val = cookie.split("=");
        obj[val[0]] = val[1];
    });
    return obj;
};
