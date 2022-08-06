import { Radio } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { MultiLang } from "components/content/element/widget";
import React from "react";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import USFlag from "../../../assets/img/flag/svg/UnitedState.svg";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    textAlign: "center",
    flex: 1,
    color: "#fff",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  mobileContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    " > span": {
      fontSize: "16px",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  title,
  open,
  icon,
  lists,
  onClose,
  onChange,
  selLanguage,
  selCurrency,
}) {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const handleSelectItem = (item) => {
    if (item?.currency) {
      onChange(
        { title: item.title, currency: item.currency, value: item.value },
        "curr"
      );
    } else {
      i18n.changeLanguage(item?.value ?? "en");
      sessionStorage.setItem(
        "language",
        JSON.stringify({
          icon: item.icon,
          title: item.title,
          value: item.value ?? "en",
        })
      );
      onChange({ icon: item.icon, title: item.title }, "lang");
    }
    onClose();
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <MultiLang text={`Select ${title}`} />
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        {lists.map((item, index) => (
          <div
            className="mobile-item"
            key={index}
            onClick={() => handleSelectItem(item)}
          >
            <div className="content">
              {item?.icon && (
                <div className="icon pr-2">
                  <ReactSVG src={item.icon ?? USFlag} alt="" />
                </div>
              )}
              <MultiLang text={item.title} />
              {item?.currency && (
                <span className="pr-2">
                  {item?.currency && <span>({item.currency})</span>}
                </span>
              )}
            </div>
            <Radio
              checked={
                title === "Currency"
                  ? item.currency === selCurrency.currency
                  : item.title === selLanguage.title
              }
              // onChange={handleChange}
              name="radio-button-demo"
              inputProps={{ "aria-label": "C" }}
            />
          </div>
        ))}
      </div>
    </Dialog>
  );
}
