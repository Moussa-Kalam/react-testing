import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const truncatedText = `${longText.substring(0, limit)}...`;
  

  it('should render the full text if less than 255 characters', () => {
    render(<ExpandableText text='Short text' />);
    expect(screen.getByText('Short text')).toBeInTheDocument();
  });

  it('should truncate the text if longer than 255 characters', () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should expand the text when show more button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it('should collapse the text when show less button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole('button', { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
