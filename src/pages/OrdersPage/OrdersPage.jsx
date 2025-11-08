import { useEffect, useState } from "react";
import OrderTable from "../../components/OrderTable/OrderTable";
import style from "./OrdersPage.module.css";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configDB/firebase";
function OrdersPage() {
  const { userId } = useParams();
  console.log(userId);

  const [orderedItems, setOrderedItems] = useState([]);

  //// load already ordered items from of a specific user from orderedItems collection from firestore
  useEffect(() => {
    const fetchOrderedItems = async () => {
      try {
        if (!userId) return; // ✅ Avoid running if no userId in URL

        //  Create a query that filters by userId
        const orderedItemsRef = collection(db, "orderedItems");
        const q = query(orderedItemsRef, where("userId", "==", userId));

        const querySnapshot = await getDocs(q);

        const orderedItemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched ordered items:", orderedItemsData);
        setOrderedItems(orderedItemsData);
      } catch (err) {
        console.error("Error fetching ordered items:", err);
      }
    };

    fetchOrderedItems();
  }, [userId]);

  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h1>Your Orders</h1>
      </div>
      <OrderTable orderedItems={orderedItems} />
    </div>
  );
}
export default OrdersPage;
