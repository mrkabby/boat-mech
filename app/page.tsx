import { ProductList } from './components/products/ProductList';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2 text-center tracking-tight">Explore Our Tools & Hardware</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center">
        Find everything you need for your projects. Quality tools, generators, pumps, ladders, and hardware equipment.
      </p>
      <ProductList />
    </div>
  );
}
