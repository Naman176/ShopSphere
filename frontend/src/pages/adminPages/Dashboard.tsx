import { BsSearch } from "react-icons/bs";
import Sidebar from "../../components/adminComponents/Sidebar";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import data from "../../assets/data.json";
import {
  BarChart,
  DoughnutChart,
} from "../../components/adminComponents/Charts";
import { BiMaleFemale } from "react-icons/bi";
import TransactionTable from "../../components/adminComponents/dashboardComponents/TransactionTable";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Serach for data, users, docs" />
          <FaRegBell />
          <img src={userImg} alt="User" />
        </div>

        <section className="widgetContainer">
          <WidgetItem
            heading="Revenue"
            value={50000}
            percent={40}
            color="rgb(0,115,255)"
            amount={true}
          />
          <WidgetItem
            heading="Users"
            value={400}
            percent={-14}
            color="rgb(0,198,202)"
          />
          <WidgetItem
            heading="Transactions"
            value={23000}
            percent={80}
            color="rgb(255, 196, 0)"
          />
          <WidgetItem
            heading="Products"
            value={1000}
            percent={30}
            color="rgb(170, 0, 255)"
          />
        </section>

        <section className="graphContainer">
          <div className="revenueChart">
            <h2>Revenue & Transactions</h2>
            <BarChart
              data1={[200, 444, 343, 556, 778, 455, 990]}
              data2={[300, 144, 433, 655, 237, 755, 190]}
              title1="Revenue"
              title2="Transaction"
              bgColor1="rgb(0,115,255)"
              bgColor2="rgba(53,162,235,0.8)"
            />
          </div>
          <div className="dashboardCategories">
            <h2>Inventory</h2>
            <div>
              {data.categories.map((i) => (
                <CategoryItem
                  key={i.heading}
                  heading={i.heading}
                  value={i.value}
                  color={`hsl(${i.value}, ${i.value}%,40%)`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="transactionContainer">
          <div className="genderChart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[12, 19]}
              bgColor={["hsl(340,82%,56%)", "rgba(53,162,235,0.8)"]}
              cutout={90}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>

          <TransactionTable data={data.transaction} />
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widgetInfo">
      <p>{heading}</p>
      <h4>{amount ? `Rs ${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> + {percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>
    <div
      className="widgetCircle"
      style={{
        background: `conic-gradient(${color} ${
          (Math.abs(percent) / 100) * 360
        }deg, rgb(255,255,255) 0)`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  heading: string;
  value: number;
  color: string;
}

const CategoryItem = ({ heading, value, color }: CategoryItemProps) => (
  <div className="categoryItem">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
