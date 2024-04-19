import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
  it('should render the details of a product', async () => {
    render(<ProductDetail productId={2} />);

    expect(
      await screen.findByText(new RegExp(products[1].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[1].price.toString()))
    ).toBeInTheDocument();
  });

  it('should render message if product is not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it('should return an error for invalid product', async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });
});
