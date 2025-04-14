import {
  DoughnutChart,
  PieChart,
} from "../../../components/adminComponents/Charts";
import Sidebar from "../../../components/adminComponents/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import { Pie } from "../../../types/types";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/apiTypes";
import Loader from "../../../components/Loader";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = usePieQuery(user?._id!);
  const charts: Pie = data?.data.charts;

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="chartContainer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>Pie & Doughnut Charts</h1>
            <section>
              <h2>Order Fulfillment Ratio</h2>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    charts.orderFullfillment.processing,
                    charts.orderFullfillment.shipped,
                    charts.orderFullfillment.delivered,
                  ]}
                  bgColor={[
                    `hsl(110,80%,80%)`,
                    `hsl(110,80%,50%)`,
                    `hsl(110,40%,50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
            </section>

            <section>
              <h2>Product Categories Ratio</h2>
              <div>
                <DoughnutChart
                  labels={charts.productCategory.map((i) => Object.keys(i)[0])}
                  data={charts.productCategory.map((i) => Object.values(i)[0])}
                  bgColor={charts.productCategory.map(
                    (i) =>
                      `hsl(${Object.values(i)[0] * 6}, ${
                        Object.values(i)[0]
                      }%, 50%)`
                  )}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
            </section>

            <section>
              <h2>Stock Availability</h2>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out  of Stock"]}
                  data={[
                    charts.stockAvailability.inStock,
                    charts.stockAvailability.outOfStock,
                  ]}
                  bgColor={[`hsl(269, 80%, 40%)`, `rgb(53, 162, 255)`]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
            </section>

            <section>
              <h2>Revenue Distribution</h2>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    charts.revenueDistribution.marketingCost,
                    charts.revenueDistribution.discount,
                    charts.revenueDistribution.burnt,
                    charts.revenueDistribution.productionCost,
                    charts.revenueDistribution.netMargin,
                  ]}
                  bgColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
            </section>

            <section>
              <h2>Users Age Group</h2>
              <div>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[
                    charts.usersAgeGroup.teen,
                    charts.usersAgeGroup.adult,
                    charts.usersAgeGroup.old,
                  ]}
                  bgColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[
                    charts.adminCustomer.admin,
                    charts.adminCustomer.customer,
                  ]}
                  bgColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
