import { useNavigate, useOutletContext } from "react-router-dom";
import style from "./FilterSidebar.module.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../configDB/firebase";

function FilterSidebar() {
  const { products, setFilteredProducts } = useOutletContext();
  const { cartItems, setCartItems } = useOutletContext();

  const [inputfilterRangeValue, setInputFilterRangeValue] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();

  ////handle purchased items
  function handlePurchase() {
    // setOrderedItems(cartItems);
    // setCartItems([]);
    //save/set ordered items to orderedItems collection in firestore
    const orderedItemsCollectionRef = collection(db, "orderedItems");
    cartItems.map(async (item) => {
      await addDoc(orderedItemsCollectionRef, {
        userId: item.userId,
        title: item.title,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        status: "success",
        orderedAt: new Date().toISOString(),
      });
    });

    ///remove from cartItems collections from firestore database
    cartItems.map(async (item) => {
      await deleteDoc(doc(db, "cartItems", item.id));
    });

    navigate(`/myorders/${cartItems[0].userId}`);
  }

  function handleFilterPrice(e) {
    const value = Number(e.target.value);

    setInputFilterRangeValue(value);
    // console.log(inputfilterRangeValue);
    applyFilters(value, selectedCategories);
  }

  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    // console.log(value, checked);

    if (checked) {
      /// "men" or "electronics" and "jewelery" so on
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    }
    applyFilters(inputfilterRangeValue, selectedCategories);
  }

  // apply combined filters (price + categories)
  function applyFilters(priceValue, categories) {
    let filteredProducts = products.filter((product) => {
      return product.price <= priceValue;
    });

    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        categories.includes(product.category)
      );
    } else {
      setFilteredProducts(filteredProducts);
    }

    setFilteredProducts(filteredProducts);
  }

  if (cartItems) {
    // console.log("cartItems", cartItems);
    return (
      <>
        <div className={style.container}>
          <div className={style.filterContainer}>
            <h2 className={style.filterHeading}>Filter</h2>
            <div className={style.price}>
              TotalPrice:
              {cartItems
                ? cartItems.reduce(
                    (acc, curr) => acc + curr.price * curr.quantity,
                    0
                  )
                : 0}
              /-
            </div>
            <button className={style.purchaseBtn} onClick={handlePurchase}>
              Purchase
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={style.container}>
          <div className={style.filterContainer}>
            <h2 className={style.filterHeading}>Filter</h2>
            <div className={style.price}>Price: {inputfilterRangeValue}</div>
            <div className={style.priceSlider}>
              <input
                type="range"
                name=""
                id=""
                min="100"
                max="99999"
                value={inputfilterRangeValue}
                onChange={handleFilterPrice}
              />
            </div>
          </div>

          <div className={style.categoryContainer}>
            <h2 className={style.categoryHeading}>Category</h2>
            <div className={style.categoryItems}>
              <div>
                <input
                  type="checkbox"
                  value="men"
                  onChange={handleCategoryChange}
                />{" "}
                <span> Men's Clothing</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  value="women"
                  onChange={handleCategoryChange}
                />
                <span> Women's Clothing</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  value="jewelery"
                  onChange={handleCategoryChange}
                />
                <span> Jewelery</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  value="electronics"
                  onChange={handleCategoryChange}
                />
                <span> Electronics </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default FilterSidebar;
