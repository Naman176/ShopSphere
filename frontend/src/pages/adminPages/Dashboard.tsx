import { BsSearch } from "react-icons/bs";
import Sidebar from "../../components/adminComponents/Sidebar";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import {
  BarChart,
  DoughnutChart,
} from "../../components/adminComponents/Charts";
import { BiMaleFemale } from "react-icons/bi";
import TransactionTable from "../../components/adminComponents/dashboardComponents/TransactionTable";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useStatsQuery } from "../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import { Stats } from "../../types/types";
import Loader from "../../components/Loader";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useStatsQuery(user?._id!);
  const stats: Stats = data?.data.stats;

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="dashboard">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={user?.photo || userImg} alt="User" />
            </div>

            <section className="widgetContainer">
              <WidgetItem
                heading="Revenue"
                value={stats.count.revenue}
                percent={stats.percentageChange.revenue}
                color="rgb(0,115,255)"
                amount={true}
              />
              <WidgetItem
                heading="Users"
                value={stats.count.user}
                percent={stats.percentageChange.user}
                color="rgb(0,198,202)"
              />
              <WidgetItem
                heading="Transactions"
                value={stats.count.order}
                percent={stats.percentageChange.order}
                color="rgb(255, 196, 0)"
              />
              <WidgetItem
                heading="Products"
                value={stats.count.product}
                percent={stats.percentageChange.product}
                color="rgb(170, 0, 255)"
              />
            </section>

            <section className="graphContainer">
              <div className="revenueChart">
                <h2>Revenue & Transactions</h2>
                <BarChart
                  data1={stats.chart.revenue}
                  data2={stats.chart.order}
                  title1="Revenue"
                  title2="Transaction"
                  bgColor1="rgb(0,115,255)"
                  bgColor2="rgba(53,162,235,0.8)"
                />
              </div>
              <div className="dashboardCategories">
                <h2>Inventory</h2>
                <div>
                  {stats.categoryCount.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        heading={heading}
                        value={value}
                        color={`hsl(${i.value}, ${i.value}%,40%)`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="transactionContainer">
              <div className="genderChart">
                <h2>Gender Ratio</h2>
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[
                    stats.userGenderratio.female,
                    stats.userGenderratio.male,
                  ]}
                  bgColor={["hsl(340,82%,56%)", "rgba(53,162,235,0.8)"]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>

              <TransactionTable data={stats.modifiedLatestTransaction} />
            </section>
          </>
        )}
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
          <HiTrendingUp /> + {`${percent > 10000 ? 9999 : percent}%`}{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}{" "}
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
        {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
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
