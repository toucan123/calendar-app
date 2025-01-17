
export const googleConsent = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${import.meta.env.VITE_BACKEND_LOCATION}/auth/callback`;
  const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email openid';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}&` +
    `access_type=offline&` + // This is required to get a refresh token
    `prompt=consent`; // Forces consent screen even if previously granted
  window.location.href = authUrl;
};