import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  // FaGamepad,
  // FaStopwatch,
} from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import {
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import { Link, Location, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isPhoneActive, setIsPhoneActive] = useState<boolean>(
    window.innerWidth < 1100
  );

  const resizeHandler = () => {
    setIsPhoneActive(window.innerWidth < 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {isPhoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)}>
          <HiMenuAlt4 />
        </button>
      )}
      <aside
        style={
          isPhoneActive
            ? {
                width: "20rem",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: showModal ? "" : "-20rem",
                transition: "all 0.5s",
              }
            : {}
        }
      >
        <h2>Logo.</h2>
        <DivOne location={location} />
        <DivTwo location={location} />
        <DivThree location={location} />
        {isPhoneActive && (
          <button id="closeSidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

interface LiProps {
  url: string;
  text: string;
  Icon: IconType;
  location: Location;
}

const DivOne = ({ location }: { location: Location }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      <Li
        url="/admin/dashboard"
        text="Dashboard"
        location={location}
        Icon={RiDashboardFill}
      />
      <Li
        url="/admin/products"
        text="Products"
        location={location}
        Icon={RiShoppingBag3Fill}
      />
      <Li
        url="/admin/customers"
        text="Customers"
        location={location}
        Icon={IoIosPeople}
      />
      <Li
        url="/admin/transaction"
        text="Transaction"
        location={location}
        Icon={AiFillFileText}
      />
    </ul>
  </div>
);

const DivTwo = ({ location }: { location: Location }) => (
  <div>
    <h5>Charts</h5>
    <ul>
      <Li
        url="/admin/chart/bar"
        text="Bar"
        location={location}
        Icon={FaChartBar}
      />
      <Li
        url="/admin/chart/pie"
        text="Pie"
        location={location}
        Icon={FaChartPie}
      />
      <Li
        url="/admin/chart/line"
        text="Line"
        location={location}
        Icon={FaChartLine}
      />
    </ul>
  </div>
);

const DivThree = ({ location }: { location: Location }) => (
  <div>
    <h5>Apps</h5>
    <ul>
      {/* <Li
        url="/admin/app/stopwatch"
        text="Stopwatch"
        location={location}
        Icon={FaStopwatch}
      /> */}
      <Li
        url="/admin/app/coupon"
        text="Coupon"
        location={location}
        Icon={RiCoupon3Fill}
      />
      {/* <Li
        url="/admin/app/toss"
        text="Toss"
        location={location}
        Icon={FaGamepad}
      /> */}
    </ul>
  </div>
);

const Li = ({ url, text, Icon, location }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? "rgba(0,155,255,0.1)"
        : "white",
    }}
  >
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default Sidebar;
