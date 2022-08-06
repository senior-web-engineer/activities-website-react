import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "./widget";
import { Typography } from "./Wrappers";
import { Select, OutlinedInput, MenuItem } from "@material-ui/core";
import useStyles from "./styles";
// import Dot from "./Dot";
import { useTheme } from "@material-ui/styles";
import { getLineChartData } from "../../../../Store/action/dashboardAction";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Legend,
  CartesianGrid,
  // Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import { MultiLang } from "../widget";

// const mainChartData = getMainChartData();

function MaterialChart() {
  var [mainChartState, setMainChartState] = useState("monthly");
  const lineChartData = useSelector((state) => state.dashboard.lineChartData);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(getLineChartData());
  }, [dispatch]);

  useEffect(() => {
    if (Object.entries(lineChartData).length > 0) {
      if (mainChartState === "monthly") {
        setChartData(lineChartData.monthlyData);
      } else if (mainChartState === "daily") {
        setChartData(lineChartData.dailyData);
      } else {
        setChartData(lineChartData.weeklyData);
      }
    }
  }, [mainChartState, lineChartData]);

  return (
    <Widget
      bodyClass={classes.mainChartBody}
      header={
        <div className={classes.mainChartHeader}>
          <Typography variant="h5" color="text" colorBrightness="secondary">
            <MultiLang text="daily_booking_cnt" />
          </Typography>
          <Select
            value={mainChartState}
            onChange={(e) => setMainChartState(e.target.value)}
            input={
              <OutlinedInput
                labelWidth={0}
                classes={{
                  notchedOutline: classes.mainChartSelectRoot,
                  input: classes.mainChartSelect,
                }}
              />
            }
            autoWidth
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
      }
    >
      <ResponsiveContainer width="100%" minWidth={500} height={350}>
        <ComposedChart
          margin={{ top: 0, right: -15, left: -15, bottom: 0 }}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          {/* <Tooltip /> */}
          <YAxis
            tick={{ fill: theme.palette.text.hint, fontSize: 14 }}
            stroke={theme.palette.text.hint}
            tickLine={true}
          />
          <XAxis
            tickFormatter={(i) => i + 1}
            tick={{ fill: theme.palette.text.hint, fontSize: 14 }}
            stroke={theme.palette.text.hint}
            tickLine={true}
          />
          {/* <Area
            type="natural"
            dataKey="desktop"
            fill={theme.palette.background.light}
            strokeWidth={0}
            activeDot={false}
          /> */}
          <Line
            type="monotone"
            dataKey={"value"}
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Widget>
  );
}
export default MaterialChart;
