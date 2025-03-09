import Sidebar from "../../../components/adminComponents/Sidebar";
import { BarChart } from "../../../components/adminComponents/Charts";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const BarCharts = () => {
  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="chartContainer">
        <h1>Bar Charts</h1>
        <section>
          <h2>Top Selling Products & Top Customers</h2>
          <BarChart
            data1={[200, 444, 343, 556, 778, 455, 990]}
            data2={[300, 144, 433, 655, 237, 755, 190]}
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
            data1={[200, 444, 343, 556, 778, 455, 990, 444, 122, 334, 890, 909]}
            data2={[]}
            title1="Products"
            title2=""
            bgColor1={`hsl(180,40%,50%)`}
            bgColor2={""}
            labels={months}
          />
        </section>
      </main>
    </div>
  );
};

export default BarCharts;
