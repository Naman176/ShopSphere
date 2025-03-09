import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const months = ["January", "February", "March", "April", "May", "June", "July"];

interface BarChartProps {
  horizontal?: boolean;
  data1: number[];
  data2: number[];
  title1: string;
  title2: string;
  bgColor1: string;
  bgColor2: string;
  labels?: string[];
}

export const BarChart = ({
  data1 = [],
  data2 = [],
  title1,
  title2,
  bgColor1,
  bgColor2,
  horizontal = false,
  labels = months,
}: BarChartProps) => {
  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    // animation:
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: title1,
        data: data1,
        backgroundColor: bgColor1,
        barThickness: "flex",
        barPercentage: 1,
        categoryPercentage: 0.4,
      },
      {
        label: title2,
        data: data2,
        backgroundColor: bgColor2,
        barThickness: "flex",
        barPercentage: 1,
        categoryPercentage: 0.4,
      },
    ],
  };
  return (
    <Bar width={horizontal ? "200%" : ""} options={barOptions} data={barData} />
  );
};

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  bgColor: string[];
  cutout?: number | string;
  legends?: boolean;
  offset?: number[];
}

export const DoughnutChart = ({
  labels,
  data,
  bgColor,
  cutout,
  legends = true,
  offset,
}: DoughnutChartProps) => {
  const doughnutData: ChartData<"doughnut", number[], string> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColor,
        borderWidth: 0,
        offset,
      },
    ],
  };
  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: legends,
        position: "bottom",
        labels: {
          padding: 40,
        },
      },
    },
    cutout,
  };
  return <Doughnut options={doughnutOptions} data={doughnutData} />;
};

interface PieChartProps {
  labels: string[];
  data: number[];
  bgColor: string[];
  offset?: number[];
}

export const PieChart = ({ labels, data, bgColor, offset }: PieChartProps) => {
  const pieData: ChartData<"pie", number[], string> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColor,
        borderWidth: 1,
        offset,
      },
    ],
  };
  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return <Pie options={pieOptions} data={pieData} />;
};

interface LineChartProps {
  data: number[];
  label: string;
  bgColor: string;
  borderColor: string;
  labels?: string[];
}

export const LineChart = ({
  data = [],
  label,
  bgColor,
  borderColor,
  labels = months,
}: LineChartProps) => {
  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    // animation:
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        fill: true,
        label,
        data,
        backgroundColor: bgColor,
        borderColor,
      },
    ],
  };
  return <Line options={lineOptions} data={lineData} />;
};
