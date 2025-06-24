import { ProductList } from './components/products/ProductList';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2 text-center tracking-tight">Explore Our Products</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center">
        Find everything you need for your marine adventures. High-quality parts, expert advice.
      </p>
      <ProductList />
    </div>
  );
}
