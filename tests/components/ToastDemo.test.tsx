import { render, screen } from '@testing-library/react';
import ToastDemo from '../../src/components/ToastDemo';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';

describe('ToastDemo', () => {
  const renderToast = () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
    return {
      button: screen.getByRole('button'),
      user: userEvent.setup(),
    };
  };

  it('should render a button to trigger the toast', () => {
    const { button } = renderToast();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/toast/i);
  });

  it('should trigger toast with the button is clicked', async () => {
    const { button, user } = renderToast();

    await user.click(button);
    const toasts = await screen.findAllByText(/success/i);

    toasts.forEach((toast) => {
      expect(toast).toBeInTheDocument();

    });
  });
});
