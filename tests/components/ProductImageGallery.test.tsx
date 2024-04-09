import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should not render any image if the imageURL list is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render the images', () => {
    const imageUrls: string[] = [
      ' https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];
    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(3);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url);
    });
  });
});
