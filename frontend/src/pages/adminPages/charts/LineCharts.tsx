import Sidebar from "../../../components/adminComponents/Sidebar";
import { LineChart } from "../../../components/adminComponents/Charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { Line } from "../../../types/types";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/apiTypes";
import Loader from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";

const { last12Months } = getLastMonths();

const LineCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useLineQuery(user?._id!);
  const charts: Line = data?.data.charts;

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="chartContainer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>Line Charts</h1>
            <section>
              <h2>Active Users</h2>
              <LineChart
                data={charts.users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={last12Months}
                bgColor="rgba(53, 162, 255, 0.5)"
              />
            </section>

            <section>
              <h2>Total Products (SKU)</h2>
              <LineChart
                data={charts.products}
                bgColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={last12Months}
                label="Products"
              />
            </section>

            <section>
              <h2>Total Revenue </h2>
              <LineChart
                data={charts.revenue}
                bgColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={last12Months}
              />
            </section>

            <section>
              <h2>Discount Allotted </h2>
              <LineChart
                data={charts.discount}
                bgColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={last12Months}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default LineCharts;
