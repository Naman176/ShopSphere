import Sidebar from "../../../components/adminComponents/Sidebar";
import { BarChart } from "../../../components/adminComponents/Charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/apiTypes";
import { Bar } from "../../../types/types";
import Loader from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";

const { last6Months, last12Months } = getLastMonths();

const BarCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useBarQuery(user?._id!);
  const charts: Bar = data?.data.charts;

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="chartContainer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>Bar Charts</h1>
            <section>
              <h2>Top Selling Products & Top Customers</h2>
              <BarChart
                data1={charts.products}
                data2={charts.users}
                labels={last6Months}
                title1="Products"
                title2="Users"
                bgColor1={`hsl(260,50%,30%)`}
                bgColor2={`hsl(360,90%,90%)`}
              />
            </section>
            <section>
              <h2>Orders Throughout the Year</h2>
              <BarChart
                horizontal={true}
                data1={charts.products}
                data2={[]}
                title1="Products"
                title2=""
                bgColor1={`hsl(180,40%,50%)`}
                bgColor2={""}
                labels={last12Months}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default BarCharts;
