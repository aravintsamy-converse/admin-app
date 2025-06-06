import UserList from '@/components/UserList';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));
const user = userEvent.setup();

beforeAll(() => {
  // Mock global fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]),
    })
  ) as jest.Mock;

});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders user list after fetching', async () => {
  render(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByTestId('user-item')).toHaveLength(2);
  });

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test('links to notes app', async () => {

  render(<UserList />);

  const linkElement = await screen.findByRole('button', { name: (/Go to Notes App/i) }); // Find link by text content
  expect(linkElement).toBeInTheDocument();
  await user.click(linkElement);
  expect(pushMock).toHaveBeenCalledWith('/notes-app');

});



