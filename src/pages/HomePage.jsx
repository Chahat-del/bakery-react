import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Gallery from "../components/Gallery";
import OrderTracker from "../components/OrderTracker";
import { useOrder } from "../OrderContext";

export default function HomePage() {
  const { activeOrder, clearOrder } = useOrder();

  return (
    <>
      <Hero />

      {/* Inline order tracker — shows below hero when an order is active */}
      {activeOrder && (
        <section style={{ padding: "2rem 0", background: "#fff7f3" }}>
          <div className="container">
            <OrderTracker
              orderNumber={activeOrder.orderNumber}
              totalSeconds={activeOrder.totalSeconds}
              remainingSeconds={activeOrder.remainingSeconds}
              onDismiss={clearOrder}
            />
          </div>
        </section>
      )}

      <About />
      <Gallery />
    </>
  );
}
