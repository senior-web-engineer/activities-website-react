import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, MenuItem, Input } from "@material-ui/core";
import useStyles from "./BigStat/styles";
import clsx from "clsx";
import { getBalanceInfo } from "../../../../Store/action/dashboardAction";
import { MultiLang } from "../widget";

function GoolgeChart() {
  const classes = useStyles();
  const [value, setValue] = useState("monthly");
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.dashboard.balance);
  const [withdrawn, setWithdrawn] = useState(0);

  useEffect(() => {
    dispatch(getBalanceInfo());
  }, [dispatch]);

  useEffect(() => {
    if (Object.entries(balance).length > 0) {
      if (value === "monthly") {
        setWithdrawn(balance.total["monthly"]);
      } else if (value === "weekly") {
        setWithdrawn(balance.total["weekly"]);
      } else {
        setWithdrawn(balance.total["daily"]);
      }
    }
  }, [value, balance]);

  return (
    <div
      style={{
        borderRadius: "20px",
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
        height: "100%",
        position: "relative",
      }}
    >
      <div className="balance-info">
        <h5>
          <MultiLang text="balance_info" />
        </h5>
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          input={
            <Input disableUnderline classes={{ input: classes.selectInput }} />
          }
          className={clsx(classes.select, "balance-info-content")}
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
      <div>
        <div className="d-flex justify-content-between p-left-30 p-right-30">
          <p>
            <MultiLang text="current_balance" />
          </p>
          <p>$ {balance?.curBalance ?? 0}</p>
        </div>
        <div className="d-flex justify-content-between p-left-30 p-right-30">
          <p>
            <MultiLang text="available_balance" />
          </p>
          <p>$ {balance?.availabeBalance ?? 0}</p>
        </div>
        <div className="d-flex justify-content-between p-left-30 p-right-30">
          <p>
            <MultiLang text="total_witdrawn" />
          </p>
          <p>$ {withdrawn}</p>
        </div>
      </div>
    </div>
  );
}
export default GoolgeChart;
