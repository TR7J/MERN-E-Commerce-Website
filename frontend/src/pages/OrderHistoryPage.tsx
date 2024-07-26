import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";

import { useGetOrderHistoryQuery } from "../hooks/orderHooks";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        /*  <div>{getError(error as ApiError)}</div> */
        <div>There was an error</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders!.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td className="td-date">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td className="td-date">
                    {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                  </td>
                  <td className="td-date">
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "No"}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
