import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Rating from "./Rating";
import Axios from "axios";

const Product = ({
  product,
  wishlist,
  setWishlist,
  userInfo,
  setNoti,
  isistudioMerch = false,
  vendor = false,
}) => {
  let history = useHistory();

  const [inWishList, setInWishlist] = useState(() =>
    product.existsInWishlist ? true : false
  );

  const addToWishlist = (id) => {
    let obj = null;

    if (userInfo) {
      if (isistudioMerch) {
        obj = {
          userId: userInfo._id,
          productId: id,
          fromPrintful: true,
        };
      } else {
        obj = {
          userId: userInfo._id,
          productId: id,
          fromPrintful: false,
        };
      }
      let config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      Axios.post("/api/wishlist", obj, config)
        .then((res) => {
          setInWishlist(true);
          setTimeout(() => {
            setNoti("");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setNoti("Please login to use wishlist feature!");
      window.scrollTo(0, 0);
      setTimeout(() => {
        setNoti("");
      }, 2000);
    }
  };

  const removeFromWishlist = (id) => {
    if (userInfo) {
      let config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      Axios.delete(`/api/wishlist/${userInfo._id}/${id}`, config)
        .then((res) => {
          setInWishlist(false);
          setNoti("Removed from wishlist");
          setTimeout(() => {
            setNoti("");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const addToCartHandler = (id) => {
    if (isistudioMerch) {
      history.push(`/istudio-merch/product/${id}`);
    } else {
      history.push(`/product/${id}`);
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="product-card-top">
          <Link
            to={
              isistudioMerch
                ? `/istudio-merch/product/${product.external_id}`
                : `/product/${product._id}`
            }
            className="product-image"
          >
            <img
              src={
                isistudioMerch
                  ? product.thumbnail_url
                  : product.thumbnailImage
              }
              alt={product.name}
            />
          </Link>
          <div className="product-card-actions">
          {inWishList ? (
              
              <button title="Already in Wishlist" 
                  className="btn btn-wishlist added"
                  onClick={() => {
                    removeFromWishlist(
                      isistudioMerch ? product.external_id : product._id
                    );
                  }}
                >
                  <i class="las la-heart"></i>
                </button>
             
            ) : (
              
                <button title="Add to Wishlist" 
                  className="btn btn-wishlist"
                  onClick={() => {
                    addToWishlist(
                      isistudioMerch ? product.external_id : product._id
                    );
                  }}
                >
                  <i className="la-heart lar"></i>
                </button>
              
            )}
            <button title="Compare" className="btn btn-compare">
              <i className="las la-random"></i>
            </button>
          </div>
          <ul className="list-inline product-badge">
            <li className="badge badge-primary">New</li>
            {!isistudioMerch ? (
                product.offerPrice ? (
                  <li className="badge badge-success">{`${Math.ceil(
                    ((product.price - product.offerPrice) / product.price) *
                      100
                  )}% Off`}</li>
                ) : (
                  <></>
                )
              ) : (
                <></>
            )}
          </ul>
        </div>
        <div className="product-card-middle">
          {!isistudioMerch ? ( 
              <div className="product-rating">          
                <div className="rating-reviews">
                  <div className="star">
                    <Rating
                      value={product.rating}
                      text={`(${product.numReviews})`}
                    />
                  </div>
                </div> 
              </div>           
          ) : (
            <></>
          )}
          
          <Link
            to={
              isistudioMerch
                ? `/istudio-merch/product/${product.external_id}`
                : `/product/${product._id}`
            }
            className="product-name"
          >
            <h6>{product.name}</h6>
          </Link>
          <div className="product-price product-price-clone">

            {!isistudioMerch ? (
                product.offerPrice ? (
                  <>
                    ${product.offerPrice} <span className="previous-price">${product.price}</span>
                  </>
                ) : (
                  <>
                    ${product.price}
                  </>
                )
              ) : (
                <></>
            )}
          </div>
        </div>
        <div className="product-card-bottom">
          <div className="product-price">
          {!isistudioMerch ? (
                product.offerPrice ? (
                  <>
                    {product.offerPrice} <span className="previous-price">{product.price}</span>
                  </>
                ) : (
                  <>
                    {product.price}
                  </>
                )
              ) : (
                <></>
            )}
          </div>
          <form>
            <button
              type="submit"
              title="Add to Cart"
              onClick={() => {
                addToCartHandler(
                  isistudioMerch ? product.external_id : product._id
                );
              }}
              className="btn btn-primary btn-add-to-cart"
            >
              <i className="las la-cart-arrow-down"></i>
              ADD TO CART
            </button>
          </form>
        </div>
      </div>




      {/* <div className={`item product product-item box-shadow`}>
        <div className="product-item-info">
          <div className="product-top">
            <Link
              to={
                isistudioMerch
                  ? `/istudio-merch/product/${product.external_id}`
                  : `/product/${product._id}`
              }
              className="product photo product-item-photo"
            >
              <span className="product-image-container">
                <span
                  className="parent_lazy product-image-wrapper lazy_loaded"
                  style={{ paddingBottom: "100%" }}
                >
                  <img
                    src={
                      isistudioMerch
                        ? product.thumbnail_url
                        : product.thumbnailImage
                    }
                    className="img-fluid product-image-photo"
                  />
                </span>
              </span>
            </Link>
          </div>
          <div className="product details product-item-details">
            <strong className="product name product-item-name">
              <Link
                to={
                  isistudioMerch
                    ? `/istudio-merch/product/${product.external_id}`
                    : `/product/${product._id}`
                }
                className="product-item-link"
              >
                {product.name}
              </Link>
            </strong>
            <Row>
              <Col xs={6}>
                <div className="price-box price-final_price">
                  {!isistudioMerch ? (
                    product.offerPrice ? (
                      <span className="dic">{`${Math.ceil(
                        ((product.price - product.offerPrice) / product.price) *
                          100
                      )}% Off`}</span>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                  

                  {!isistudioMerch ? (
                    product.offerPrice ? (
                      <>
                        <span className="special-price">
                          <span className="price-container price-final_price tax weee">
                            <span className="price-label">Special Price</span>
                            <span className="price-wrapper ">
                              <span className="price">
                                ${product.offerPrice}
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="old-price">
                          <span className="price-container price-final_price tax weee">
                            <span className="price-label">Regular Price</span>
                            <span className="price-wrapper">
                              <span className="price">${product.price}</span>
                            </span>
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="special-price">
                          <span className="price-container price-final_price tax weee">
                            <span className="price-label">Price</span>
                            <span className="price-wrapper ">
                              <span className="price">${product.price}</span>
                            </span>
                          </span>
                        </span>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </Col>
              {!isistudioMerch ? (
                <Col xs={6}>
                  <div className="rating-reviews">
                    <div className="star">
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </div>
                  </div>
                </Col>
              ) : (
                <></>
              )}
            </Row>
            <div className="product-item-inner">
              <div className="product actions product-item-actions">
                <div className="actions-primary">
                  <form>
                    <button
                      type="submit"
                      title="Add to Cart"
                      onClick={() => {
                        addToCartHandler(
                          isistudioMerch ? product.external_id : product._id
                        );
                      }}
                      className="action tocart primary"
                    >
                      <span>Add to Cart</span>
                    </button>
                  </form>
                </div>
                {inWishList ? (
                  <div className="actions-secondary">
                    <a
                      className="action towishlist"
                      onClick={() => {
                        removeFromWishlist(
                          isistudioMerch ? product.external_id : product._id
                        );
                      }}
                      title="Already in Wishlist"
                    >
                      <span>
                        <i className="fas fa-heart"></i> Already in Wishlist
                      </span>
                    </a>
                  </div>
                ) : (
                  <div className="actions-secondary">
                    <a
                      className="action towishlist"
                      onClick={() => {
                        addToWishlist(
                          isistudioMerch ? product.external_id : product._id
                        );
                      }}
                      title="Add to Wish List"
                    >
                      <span>
                        <i className="far fa-heart"></i> Add to Wish List
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Product;
