import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it('should render the details of a product', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
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

  it('should render an error if product fetching fails', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));

    render(<ProductDetail productId={2} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after fetching data', async () => {
    render(<ProductDetail productId={productId} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductDetail productId={2} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
