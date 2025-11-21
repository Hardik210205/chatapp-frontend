// Use env var set at build time. Defaults to localhost for local dev.
const API_HOST = "https://chatapp-backend-m6fs.onrender.com";

export const host = API_HOST;
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;

// canonical name (lowercase)
export const setAvatarRoute = `${host}/api/auth/setavatar`;
// alias with capital S if some files import SetAvatarRoute
export const SetAvatarRoute = setAvatarRoute;

export const allUsersRoute = `${host}/api/auth/allusers`;

// send message (singular canonical)
export const sendMessageRoute = `${host}/api/messages/addmsg`;
// alias plural if some files import sendMessageRoutes
export const sendMessageRoutes = sendMessageRoute;

// get all messages (canonical)
export const getAllMessagesRoute = (id) => `${host}/api/messages/getmsg/${id}`;
// alias variations found in code
export const getAllMessageRoutes = getAllMessagesRoute;
export const getAllMessageRoute = getAllMessagesRoute;
