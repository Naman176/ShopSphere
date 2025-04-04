import {
  DoughnutChart,
  PieChart,
} from "../../../components/adminComponents/Charts";
import Sidebar from "../../../components/adminComponents/Sidebar";
import { categories } from "../../../assets/data.json";

const PieCharts = () => {
  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="chartContainer">
        <h1>Pie & Doughnut Charts</h1>
        <section>
          <h2>Order Fulfillment Ratio</h2>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[12, 9, 13]}
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
              labels={categories.map((i) => i.heading)}
              data={categories.map((i) => i.value)}
              bgColor={categories.map(
                (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
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
              data={[40, 20]}
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
              data={[32, 18, 5, 20, 25]}
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
              data={[30, 250, 70]}
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
              data={[40, 250]}
              bgColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
