import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AuthContext } from '../context/AuthContext';
import React from 'react';

describe('useAuth', () => {
  it('returns user from context', () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: mockUser, session: null }}>
        {children}
      </AuthContext.Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    if (result.current && typeof result.current === 'object' && 'user' in result.current) {
      expect(result.current.user).toEqual(expect.objectContaining({
        id: '1',
        email: 'test@test.com',
        aud: 'authenticated',
      }));
    } else {
      throw new Error('user not found in result.current');
    }
  });
});
