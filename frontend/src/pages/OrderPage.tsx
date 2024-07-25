import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { /* useContext, */ useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { format } from "date-fns";

import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../hooks/orderHooks";

/* import { Store } from "../context/Store"; */
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import { Store } from "../context/Store";

export default function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!);

  const { mutateAsync: payOrder, isLoading: loadingPay } =
    usePayOrderMutation();
  // Initialize the new deliver order mutation
  const { mutateAsync: deliverOrder } = useDeliverOrderMutation();

  // New handler to deliver the order
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId!);
      refetch();
      toast.success("Order delivered successfully");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };
  const testPayHandler = async () => {
    await payOrder({ orderId: orderId! });
    refetch();
    toast.success("Order is paid");
  };

  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer();

  const { data: paypalConfig } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypalConfig!.clientId,
            currency: "KSH",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [paypalConfig]);

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical" },
    createOrder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID;
        });
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          await payOrder({ orderId: orderId!, ...details });
          refetch();
          toast.success("Order is paid successfully");
        } catch (err) {
          toast.error(getError(err as ApiError));
        }
      });
    },
    onError: (err) => {
      toast.error(getError(err as ApiError));
    },
  };

  return isLoading ? (
    <Loading />
  ) : error ? (
    /* <div>{getError(error as ApiError)}</div> */
    <div>There was an error</div>
  ) : !order ? (
    <div>Order Not Found</div>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="order-id-h1">Order {orderId}</h1>
      <div className="summary-item-details-price">
        <div className="summary-item-details">
          <div className="mb-3">
            <div>
              <h3>Shipping</h3>
              <div>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </div>
              {order.isDelivered ? (
                <div>
                  <strong>Delivered at:</strong>{" "}
                  {format(new Date(order.deliveredAt), "PPPpp")}
                </div>
              ) : (
                <div>
                  <strong>Status:</strong> Not Delivered
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div>
              <h3>Payment</h3>
              <div>
                <strong>Method:</strong> {order.paymentMethod}
              </div>
              {order.isPaid ? (
                <div>
                  <strong>Paid at:</strong>{" "}
                  {format(new Date(order.paidAt), "PPPpp")}
                </div>
              ) : (
                <div>
                  <strong>Status:</strong> Not Paid
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div>
              <h3>Items</h3>
              <div>
                {order.orderItems.map((item) => (
                  <div key={item._id}>
                    <div className="order-item">
                      <div className="order-item-image">
                        <img
                          src=/* {item.image} */ {`http://localhost:8000${item.image}`}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        ></img>{" "}
                      </div>
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      <div>
                        <span>{item.quantity}</span>
                      </div>
                      <div>{item.price} KSH</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="summary-item-price">
          <h3>Order Summary</h3>
          <div className="purchase-div">
            <div className="order-summary">
              <div>
                <div className="order-summary-item">
                  <div className="order-summary-label">Items</div>
                  <div className="order-summary-value">
                    {order.itemsPrice.toFixed(2)} KSH
                  </div>
                </div>
              </div>
              <div>
                <div className="order-summary-item">
                  <div className="order-summary-label">Shipping</div>
                  <div className="order-summary-value">
                    {order.shippingPrice.toFixed(2)} KSH
                  </div>
                </div>
              </div>
              <div>
                <div className="order-summary-item">
                  <div className="order-summary-label">Tax</div>
                  <div className="order-summary-value">
                    {order.taxPrice.toFixed(2)} KSH
                  </div>
                </div>
              </div>
              <div className="order-summary-item">
                <div className="order-summary-label">
                  <strong> Order Total</strong>
                </div>
                <div className="order-summary-value">
                  <strong>{order.totalPrice.toFixed(2)} KSH</strong>
                </div>
              </div>
              {!order.isPaid && (
                <div>
                  {isPending ? (
                    <Loading />
                  ) : isRejected ? (
                    <div>Error in connecting to PayPal</div>
                  ) : (
                    <div>
                      <PayPalButtons
                        {...paypalbuttonTransactionProps}
                      ></PayPalButtons>
                      <button
                        onClick={testPayHandler}
                        className="order-summary-button"
                      >
                        Purchase Now
                      </button>
                    </div>
                  )}
                  {loadingPay && <Loading />}
                </div>
              )}

              {!order.isDelivered && order.isPaid && userInfo?.isAdmin && (
                <button
                  onClick={deliverOrderHandler}
                  className="order-summary-button"
                >
                  Deliver Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
