export interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

let tokenClient: google.accounts.oauth2.TokenClient | null = null;

export const GoogleAuthService = {
  initialize(clientId: string) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.appdata openid profile email",
      callback: () => {},
    });
  },

  signIn(): Promise<{ token: string; userInfo: UserInfo }> {
    return new Promise((resolve, reject) => {
      if (!tokenClient) {
        reject(new Error("GoogleAuthService not initialized"));
        return;
      }

      tokenClient.callback = async (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        try {
          const userInfo = await GoogleAuthService.getUserInfo(response.access_token);
          resolve({ token: response.access_token, userInfo });
        } catch (err) {
          reject(err);
        }
      };

      tokenClient.requestAccessToken();
    });
  },

  async signOut(token: string): Promise<void> {
    return new Promise((resolve) => {
      google.accounts.oauth2.revoke(token, () => resolve());
    });
  },

  async getUserInfo(token: string): Promise<UserInfo> {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user info");
    const data = await response.json();
    return { name: data.name, email: data.email, picture: data.picture };
  },
};
