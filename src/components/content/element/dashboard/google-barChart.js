import { Input, MenuItem, Select } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../../../Store/action/dashboardAction";
import { MultiLang } from "../widget";
import useStyles from "./BigStat/styles";

function GoggleBarChart() {
  const [value, setValue] = useState("monthly");
  const classes = useStyles();
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState([]);
  const barChartData = useSelector((state) => state.dashboard.barChartData);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(Actions.getBookingInfoBarChart());
  }, [dispatch]);

  useEffect(() => {
    if (barChartData && Object.entries(barChartData).length > 0) {
      if (value === "monthly") {
        setChartData(barChartData.monthlyData);
      } else if (value === "weekly") {
        setChartData(barChartData.weeklyData);
      } else {
        setChartData(barChartData.dailyData);
      }
    }
  }, [barChartData, value]);

  return (
    <div
      style={{
        borderRadius: "20px",
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
        position: "relative",
      }}
    >
      {chartData && (
        <Chart
          width={"100%"}
          height={"350px"}
          chartType="Bar"
          className="google-chart"
          data={
            chartData.length > 0
              ? chartData
              : [
                  [
                    `${value}`,
                    `${t("active_bookings")}`,
                    `${t("completed_bookings")}`,
                    `${t("canceled_bookings")}`,
                  ],
                  [`${t("active")}`, 0, 0, 0],
                  [`${t("complete")}`, 0, 0, 0],
                  [`${t("canceled")}`, 0, 0, 0],
                ]
          }
          options={{
            chart: {
              title: `${t("booking_info")}`,
            },
            titleTextStyle: {
              fontSize: 18, // 12, 18 whatever you want (don't specify px)
              bold: true, // true or false
            },
            chartArea: { width: "50%" },
          }}
        />
      )}
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        input={
          <Input disableUnderline classes={{ input: classes.selectInput }} />
        }
        className={clsx(classes.select, "google-barChart")}
      >
        <MenuItem value="daily">
          <MultiLang text="Daily" />
        </MenuItem>
        <MenuItem value="weekly">
          <MultiLang text="Weekly" />
        </MenuItem>
        <MenuItem value="monthly">
          <MultiLang text="Monthly" />
        </MenuItem>
      </Select>
    </div>
  );
}
export default GoggleBarChart;
