export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('access_token');
  
  if (!refreshToken) {
    console.error('No refresh token found');
    return;
  }

  try {
    console.log('Attempting to refresh token...');
    const response = await fetch('https://frontend-test-api.aircall.dev/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to refresh token:', response.status);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);;
  } catch (error: any) {
    console.error('Error refreshing token:', error.message);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

  
export const setUpTokenRefresh = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  const expiry = decodeJwt(token).exp; 
  const timeLeft = expiry * 1000 - Date.now(); 
  const refreshTime = timeLeft - 20 * 1000; 
  if (refreshTime > 0) {
    setTimeout(async () => {
      await refreshToken();
      setUpTokenRefresh(); 
    }, refreshTime);
  } else {
    refreshToken();
  }
};

  
export const decodeJwt = (token: string) => {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  };
  