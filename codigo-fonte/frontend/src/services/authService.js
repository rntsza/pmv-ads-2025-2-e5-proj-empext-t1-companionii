import { api, handleApiError } from './api';

export const authService = {
  // Login user
  login: async credentials => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // TODO: cadastro apenas pelo ADMIN via convites
  // register: async userData => {
  //   try {
  //     const response = await api.post('/auth/register', userData);
  //     return response.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // },

  // Forgot password
  forgotPassword: async email => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // TODO: sem refresh token por enquanto
  // refreshToken: async refreshToken => {
  //   try {
  //     const response = await api.post('/auth/refresh', { refreshToken });
  //     return response.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // },

  // TODO: logout apenas do lado do cliente
  // logout: async token => {
  //   try {
  //     await api.post(
  //       '/auth/logout',
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );
  //   } catch (error) {
  //     // Don't throw error on logout failure
  //     console.error('Logout error:', error);
  //   }
  // },

  // Get current user
  getCurrentUser: async token => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // TODO: sem Google OAuth por enquanto
  // Google OAuth
  // getGoogleAuthUrl: () => {
  //   return `${BASE_URL}/auth/google`;
  // },

  // Verify Google OAuth callback
  // verifyGoogleAuth: async (code, state) => {
  //   try {
  //     const response = await api.get('/auth/google/callback', {
  //       params: { code, state },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Resend verification email
  resendVerification: async email => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Verify email with token
  verifyEmail: async token => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update user profile
  updateProfile: async profileData => {
    try {
      // Map avatar to imageUrl for backend compatibility
      const backendData = {
        name: profileData.name,
        email: profileData.email,
        imageUrl: profileData.avatar,
      };
      const response = await api.patch('/users/profile', backendData);
      // Map imageUrl back to avatar for frontend
      return {
        ...response.data,
        avatar: response.data.imageUrl,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Change password
  changePassword: async (password, token) => {
    try {
      const response = await api.post('/auth/reset-password', {
        password,
        token,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
