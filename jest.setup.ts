import '@testing-library/jest-dom';
import React from 'react'
import fetchMock from 'jest-fetch-mock'

process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000"
process.env.NEXT_PUBLIC_CLIENT_ID = "test-client"
process.env.NEXT_PUBLIC_SECRET_KEY = "test-secret"
process.env.NEXT_PUBLIC_BACKEND_BASE_URL = "http://localhost:4000"
process.env.NEXT_PUBLIC_ACCESS_TOKEN = "test-token"


module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Ensure this points to the correct setup file
  testEnvironment: 'jsdom',
}
 
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement('img', { ...props })
  },
}))
  
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  configurable: true,
  value: () => false,
})
 
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  configurable: true,
  value: () => {},
})
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: () => jest.fn(),
      replace: () => jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
}))
window.HTMLElement.prototype.scrollIntoView = jest.fn();
 
 
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
 
fetchMock.enableMocks()