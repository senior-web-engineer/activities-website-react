import React, { useState } from "react";
import { Grid, Select, MenuItem, Input } from "@material-ui/core";
// import { ArrowForward as ArrowForwardIcon } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { BarChart, Bar } from "recharts";
import classnames from "classnames";
import clsx from "clsx";
// styles
import useStyles from "./styles";
// components
import Widget from "../widget";
import { Typography } from "../Wrappers";
import { MultiLang } from "../../widget";

export default function BigStat(props) {
  var { total, color, activitiesInfo } = props;
  var classes = useStyles();
  var theme = useTheme();
  // local
  var [value, setValue] = useState("monthly");

  return (
    <Widget
      header={
        <div className={classes.title}>
          <Typography variant="h4">
            <MultiLang text={"activities"} />
          </Typography>

          <Select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            input={
              <Input
                disableUnderline
                classes={{ input: classes.selectInput }}
              />
            }
            className={classes.select}
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
      upperTitle
      bodyClass={classes.bodyWidgetOverflow}
    >
      <div className={classes.totalValueContainer}>
        <div className={clsx(classes.totalValue, "d-flex")}>
          <div className="d-flex flex-column">
            <Typography size="xxl" color="text" colorBrightness="secondary">
              {total[value]}
            </Typography>
            <h4 className="m-0 pl-2">
              <MultiLang text="Bookings" />
            </h4>
          </div>
          <Typography color={total.percent.profit ? "success" : "secondary"}>
            {total.percent.value > 0
              ? `+ ${total.percent.value}`
              : total.percent.value}
          </Typography>
        </div>
        <BarChart width={150} height={70} data={getRandomData()}>
          <Bar
            dataKey="value"
            fill={theme.palette[color].main}
            radius={10}
            barSize={10}
          />
        </BarChart>
      </div>
      <div className={classes.bottomStatsContainer}>
        <div className={classnames(classes.statCell, classes.borderRight)}>
          <Grid container alignItems="center">
            <Typography variant="h6">{activitiesInfo.registrations}</Typography>
            {/* <ArrowForwardIcon
              className={classnames(classes.profitArrow, {
                [!registrations[value].profit]: classes.profitArrowDanger,
              })}
            /> */}
          </Grid>
          <Typography size="sm" color="text" colorBrightness="secondary">
            <MultiLang text="Registrations" />
          </Typography>
        </div>
        <div className={classes.statCell}>
          <Grid container alignItems="center">
            <Typography variant="h6">{activitiesInfo.completed}</Typography>
            {/* <ArrowForwardIcon
              className={classnames(classes.profitArrow, {
                [!registrations[value].profit]: classes.profitArrowDanger,
              })}
            /> */}
          </Grid>
          <Typography size="sm" color="text" colorBrightness="secondary">
            <MultiLang text="Completed" />
          </Typography>
        </div>
        <div className={classnames(classes.statCell, classes.borderRight)}>
          <Grid container alignItems="center">
            <Typography variant="h6">{activitiesInfo?.views || 0}</Typography>
            {/* <ArrowForwardIcon
              className={classnames(classes.profitArrow, {
                [classes.profitArrowDanger]: !registrations[value].profit,
              })}
            /> */}
          </Grid>
          <Typography size="sm" color="text" colorBrightness="secondary">
            <MultiLang text="views" />
          </Typography>
        </div>
      </div>
    </Widget>
  );
}

function getRandomData() {
  return Array(7)
    .fill()
    .map(() => ({ value: Math.floor(Math.random() * 10) + 1 }));
}
