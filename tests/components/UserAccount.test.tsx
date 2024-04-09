import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('UserAccount', () => {
  it('should render the username in the DOM', () => {
    const user: User = { id: 1, name: 'Moussa' };

    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it('should render the edit button if the user is an admin', () => {
    const user: User = { id: 1, name: 'Moussa', isAdmin: true };

    render(<UserAccount user={user} />);

    const editButton = screen.getByRole('button');

    expect(editButton).toHaveTextContent(/edit/i);
    expect(editButton).toBeInTheDocument();
  });

  it('should not render the edit button if the user is not an admin', () => {
    const user: User = { id: 2, name: 'Pablo' };

    render(<UserAccount user={user} />);

    const editButton = screen.queryByRole('button');
    expect(editButton).not.toBeInTheDocument();
  });
});
