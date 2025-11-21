const API_HOST = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const host = API_HOST;
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = (id) => `${host}/api/messages/getmsg/${id}`;
