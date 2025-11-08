import style from "./OrderTable.module.css";

function OrderTable({ orderedItems = [] }) {
  // Prevent rendering errors when data not yet loaded
  if (!orderedItems || orderedItems.length === 0) {
    return <p style={{ color: "red", fontSize: "25px" }}>No orders found.</p>;
  }

  // Safely access the date
  const orderDate = orderedItems[0]?.orderedAt
    ? orderedItems[0].orderedAt.substring(0, 10)
    : "Unknown Date";

  return (
    <>
      <div className={style.date}>Ordered On: {orderDate}</div>

      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>

          <tbody>
            {orderedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="3">Total Price</td>
              <td>
                ₹
                {orderedItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default OrderTable;
