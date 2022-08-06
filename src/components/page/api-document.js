import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import PropTypes from "prop-types";
import React, { useState } from "react";
import apikey from "../../assets/img/apikey.png";
import { Footer } from "../layout/footer";
import SideBar from "./profile/sidebar-component";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #eee",
    borderRadius: "20px",
    "@media (min-width: 600px)": {
      "& .MuiTab-root": {
        minWidth: "65px",
      },
    },
  },
}));

function ApiDocument() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [selTr, setSelTr] = useState("0");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
        {/* <!-- ends: .	 --> */}
      </section>

      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={19} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-comment cu-icon-color"></span>
                        <MultiLang text="api_doc" />
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <div className="api-list-content ">
                      <h4>
                        {" "}
                        <MultiLang text="api_list" />
                      </h4>
                      <table className="table-responsive table api-method-table mt-3 mb-3 w-100">
                        <thead>
                          <tr>
                            <th scope="col">
                              {" "}
                              <MultiLang text="api_doc" />
                            </th>
                            <th scope="col">
                              {" "}
                              <MultiLang text="method" />
                            </th>
                            <th scope="col">
                              {" "}
                              <MultiLang text="description" />{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            className={`${selTr === "0" ? "selected-tr" : ""}`}
                            onClick={() => setSelTr("0")}
                          >
                            <td>
                              https://www.activities.app/api/activities?email=__YOUR_EMAIL__
                            </td>
                            <td>GET</td>
                            <td>
                              {" "}
                              <MultiLang text="all_activity_field" />
                            </td>
                          </tr>
                          <tr
                            className={`${selTr === "1" ? "selected-tr" : ""}`}
                            onClick={() => setSelTr("1")}
                          >
                            <td>
                              https://www.activities.app/api/bookings?email=__YOUR_EMAIL__
                            </td>
                            <td>GET</td>
                            <td>
                              {" "}
                              <MultiLang text="all_booking_info" />
                            </td>
                          </tr>
                          <tr
                            className={`${selTr === "2" ? "selected-tr" : ""}`}
                            onClick={() => setSelTr("2")}
                          >
                            <td>https://www.activities.app/api/activityId</td>
                            <td>PUT</td>
                            <td>
                              {" "}
                              <MultiLang text="new_activity_info" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {selTr === "2" && (
                      <div>
                        <h2>
                          {" "}
                          <MultiLang text="api_endpoint" />
                        </h2>
                        <p className="mt-3">
                          {" "}
                          <MultiLang text="order_to_create" />:
                        </p>
                        <table className="api-method-table mt-3 mb-3 w-100">
                          <thead>
                            <tr>
                              <th style={{ width: "40%" }}>Name</th>
                              <th>
                                Description
                                <MultiLang text="description" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>option_field1_title</td>
                              <td>
                                {" "}
                                <MultiLang text="optional1_activity" />
                              </td>
                            </tr>
                            <tr>
                              <td>option_field2_title</td>
                              <td>
                                {" "}
                                <MultiLang text="optional2_activity" />
                              </td>
                            </tr>
                            <tr>
                              <td>ad_title</td>
                              <td>
                                <MultiLang text="name_activity" />
                              </td>
                            </tr>
                            <tr>
                              <td>ad_description</td>
                              <td>
                                {" "}
                                <MultiLang text="desc_activity" />
                              </td>
                            </tr>
                            <tr>
                              <td>video</td>
                              <td>
                                {" "}
                                <MultiLang text="url_activity_video" />
                              </td>
                            </tr>
                            <tr>
                              <td>custom_terms</td>
                              <td>
                                {" "}
                                <MultiLang text="term_activity" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="getting-started">
                      <h2 className="mb-2">
                        {" "}
                        <MultiLang text="getting_start" />
                      </h2>
                      <div className="mb-2">
                        <p className="text-justify	">
                          {" "}
                          <MultiLang text="api_access_key" />
                        </p>
                        <div className="get-apikey-img">
                          <img
                            src={apikey}
                            alt=""
                            className="w-100"
                            style={{ borderRadius: "30px" }}
                          />
                        </div>
                      </div>
                    </div>
                    <h2 className="mb-2 mt-2">
                      {" "}
                      <MultiLang text="quick_start" />
                    </h2>
                    <p>
                      <MultiLang text="here_are_somee_code" /> <br />{" "}
                      <MultiLang text="you_can_get_in" />
                      <a href="/accesskey-management">
                        <MultiLang text="api_key_management" />
                      </a>
                    </p>
                    <div className="get-activities-api">
                      <div className={classes.root}>
                        <AppBar position="static">
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="simple tabs example"
                            variant="scrollable"
                            scrollButtons="on"
                          >
                            <Tab label="CURL" {...a11yProps(0)} />
                            <Tab label="PHP" {...a11yProps(1)} />
                            <Tab label="PYTHON" {...a11yProps(2)} />
                            <Tab label="NODE" {...a11yProps(3)} />
                            <Tab label="RUBY" {...a11yProps(4)} />
                            {/* <Tab label="GO" {...a11yProps(5)} /> */}
                            <Tab label="C#" {...a11yProps(5)} />
                          </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                          <pre>
                            {selTr === "0" && (
                              <code>
                                curl --location --request GET
                                'https://www.activities.app/api/activities?email=__YOUR_EMAIL__
                                \ {`\n`}
                                --header 'Authorization: Bearer
                                __YOUR_API_KEY__' \{`\n`}
                                --header 'Content-Type: application/json' \
                                {`\n`}
                                --data-raw ''
                              </code>
                            )}
                            {selTr === "1" && (
                              <code>
                                curl --location --request GET
                                'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__
                                \ {`\n`}
                                --header 'Authorization: Bearer
                                __YOUR_API_KEY__' \{`\n`}
                                --header 'Content-Type: application/json' \
                                {`\n`}
                                --data-raw ''
                              </code>
                            )}
                            {selTr === "2" && (
                              <code>
                                curl --location --request PUT
                                'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                \{"\n"}
                                --header 'Authorization: Bearer
                                __YOUR_API_KEY__' \{"\n"}
                                --header 'Content-Type: application/json' \
                                {"\n"}
                                --data-raw '{`{`}
                                {"\n"}
                                &nbsp;"option_field1_title": string,{"\n"}
                                &nbsp;"option_field2_title": string,{"\n"}
                                &nbsp;"ad_title": string,{"\n"}
                                &nbsp;"ad_description": "... .", {"\n"}
                                &nbsp;"video": string,{"\n"}
                                &nbsp;"custom_terms": string {"\n"}
                                {`}`}'
                              </code>
                            )}
                          </pre>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                          <pre>
                            <code>
                              <span className="token variable">$curl</span>
                              <span className="token operator"> = </span>
                              <span className="token function">curl_init</span>
                              <span className="token punctuation">(</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;{`\n`}</span>
                              {`\n`}
                              <span className="token function">
                                curl_setopt_array
                              </span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">$curl</span>
                              <span className="token punctuation">,</span>
                              <span className="token keyword"> array</span>
                              <span className="token punctuation">(</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_URL
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              {selTr === "0" && (
                                <span className="token double-quoted-string string">
                                  'https://www.activities.app/api/activities?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "1" && (
                                <span className="token double-quoted-string string">
                                  'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token double-quoted-string string">
                                  'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_RETURNTRANSFER
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token boolean constant">
                                true
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_ENCODING
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token double-quoted-string string">
                                ''
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_MAXREDIRS
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token double-quoted-string number">
                                10
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_TIMEOUT
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token double-quoted-string number">
                                0
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_FOLLOWLOCATION
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token boolean constant">
                                true
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_HTTP_VERSION
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token constant">
                                CURL_HTTP_VERSION_1_1
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token constant">
                                {" "}
                                CURLOPT_CUSTOMREQUEST
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              {(selTr === "1" || selTr === "0") && (
                                <span className="token double-quoted-string string">
                                  'GET'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token double-quoted-string string">
                                  'PUT'
                                </span>
                              )}
                              <span className="token punctuation">,</span>
                              {`\n`}
                              {selTr === "2" && (
                                <>
                                  <span className="token constant">
                                    {" "}
                                    CURLOPT_POSTFIELDS
                                  </span>
                                  <span className="token operator"> =</span>
                                  <span className="token operator">&gt; </span>
                                  <span className="token punctuation">
                                    '{`{`}
                                  </span>
                                  {`\n`}
                                  <span className="token string">
                                    {" "}
                                    "option_field1_title"
                                  </span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  <span className="token punctuation">,</span>
                                  {`\n`}
                                  <span className="token string">
                                    {" "}
                                    "option_field2_title"
                                  </span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  <span className="token punctuation">,</span>
                                  {`\n`}
                                  <span className="token string">
                                    {" "}
                                    "ad_title"
                                  </span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  <span className="token punctuation">,</span>
                                  {`\n`}
                                  <span className="token string">
                                    {" "}
                                    "ad_description"
                                  </span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  <span className="token punctuation">,</span>
                                  {`\n`}
                                  <span className="token string"> "video"</span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  <span className="token punctuation">,</span>
                                  {`\n`}
                                  <span className="token string">
                                    {" "}
                                    "custom_terms"
                                  </span>
                                  <span className="token punctuation">:</span>
                                  <span className="token string"> string</span>
                                  {`\n`}
                                  <span className="token punctuation">
                                    '{`}`}
                                  </span>
                                  {`\n`}
                                </>
                              )}
                              <span className="token constant">
                                {" "}
                                CURLOPT_HTTPHEADER
                              </span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token keyword">array</span>
                              <span className="token punctuation">(</span>
                              {`\n`}
                              <span className="token double-quoted-string string">
                                {" "}
                                'Authorization: Bearer __YOUR_API_KEY__'
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token double-quoted-string string">
                                {" "}
                                'Content-Type: application/json'
                              </span>
                              {`\n`}
                              <span className="token punctuation"> )</span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              {`\n`}
                              <span className="token variable">$response</span>
                              <span className="token operator"> = </span>
                              <span className="token function">curl_exec</span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">$curl</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              {`\n`}
                              <span className="token function">curl_close</span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">$curl</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              <span className="token function">echo</span>
                              <span className="token variable"> $response</span>
                            </code>
                          </pre>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                          <pre>
                            <code>
                              <span className="token keyword">import</span>{" "}
                              requests{`\n`}
                              url
                              <span className="token operator"> = </span>
                              {selTr === "0" && (
                                <span className="token string">
                                  'https://www.activities.app/api/activities?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "1" && (
                                <span className="token string">
                                  'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">
                                  'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {`\n`}
                              {`\n`}
                              payload<span className="token operator"> = </span>
                              {(selTr === "0" || selTr === "1") && (
                                <span className="token string">{`{}`}</span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">
                                  {`{`}\r\n
                                  \"option_field1_title\":\"string\",\r\n
                                  \"option_field2_title\":\"string\",\r\n
                                  \"ad_title\": \"string\",\r\n
                                  \"ad_description\": \"string\", \r\n
                                  \"video\": \"string\",\r\n \"custom_terms\":
                                  \"string\" \r\n{`}`}
                                </span>
                              )}
                              {`\n`}
                              headers<span className="token operator"> = </span>
                              <span className="token punctuation">{`{`}</span>
                              {`\n`}
                              <span className="token string">
                                {" "}
                                'Authorization'
                              </span>
                              <span className="token punctuation">: </span>
                              <span className="token string">
                                'Bearer __YOUR_API_KEY__'
                              </span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              <span className="token string">
                                {" "}
                                'Content-Type'
                              </span>
                              <span className="token punctuation">:</span>
                              <span className="token string">
                                'application/json'
                              </span>
                              {`\n`}
                              <span className="token punctuation">{`}`}</span>
                              {`\n`}
                              {`\n`}
                              response{" "}
                              <span className="token operator">= </span>requests
                              <span className="token punctuation">.</span>
                              post<span className="token punctuation">(</span>
                              {(selTr === "0" || selTr === "1") && (
                                <span className="token string">'GET'</span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">'PUT'</span>
                              )}
                              <span className="token punctuation">, </span>
                              url<span className="token punctuation">, </span>
                              headers<span className="token operator">=</span>
                              headers
                              <span className="token punctuation">, </span>
                              data<span className="token operator">=</span>
                              payload
                              <span className="token punctuation">)</span>
                              {`\n`}
                              {`\n`}
                              <span className="token function">print</span>
                              <span className="token punctuation">(</span>
                              response
                              <span className="token punctuation">.</span>text
                              <span className="token punctuation">)</span>
                            </code>
                          </pre>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                          <pre>
                            <code>
                              <span className="token keyword">const</span> axios
                              <span className="token operator"> = </span>
                              <span className="token function">require</span>
                              <span className="token punctuation">(</span>
                              <span className="token string">'axios'</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              <span className="token keyword">let</span> data
                              <span className="token operator"> = </span>
                              {(selTr === "0" || selTr === "1") && (
                                <span className="token string">''</span>
                              )}
                              {selTr === "2" && (
                                <>
                                  <span className="token keyword">JSON</span>
                                  <span className="token punctuation">.</span>
                                  <span className="token keyword">
                                    stringify
                                  </span>
                                  <span className="token punctuation">
                                    ({`{`}
                                  </span>
                                  <span className="token string">
                                    'option_field1_title'
                                  </span>
                                  :<span className="token string">string</span>,
                                  <span className="token string">
                                    'option_field2_title'
                                  </span>
                                  :<span className="token string">string</span>,
                                  <span className="token string">
                                    'custom_terms'
                                  </span>
                                  :<span className="token string">string</span>,
                                  <span className="token string">
                                    'ad_title'
                                  </span>
                                  :<span className="token string">string</span>,
                                  <span className="token string">
                                    'ad_description'
                                  </span>
                                  :<span className="token string">string</span>,
                                  <span className="token string">'video'</span>:
                                  <span className="token string">string</span>,
                                  <span className="token punctuation">
                                    {`}`})
                                  </span>
                                </>
                              )}
                              <span className="token punctuation">;</span>
                              {`\n`}
                              {`\n`}
                              <span className="token keyword">let</span> config
                              <span className="token operator"> = </span>
                              <span className="token punctuation">{`{`}</span>
                              {`\n`}
                              &nbsp;method
                              <span className="token punctuation">: </span>
                              <span className="token string">'get'</span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              &nbsp;url
                              <span className="token punctuation">:</span>
                              {selTr === "0" && (
                                <span className="token string">
                                  {" "}
                                  'https://www.activities.app/api/activities?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "1" && (
                                <span className="token string">
                                  {" "}
                                  'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">
                                  {" "}
                                  'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              <span className="token punctuation">,</span>
                              {`\n`}
                              &nbsp;headers{" "}
                              <span className="token punctuation">: </span>
                              <span className="token punctuation">{`{`}</span>
                              {`\n`}
                              <span className="token double-quoted-string string">
                                &nbsp;&nbsp;'Authorization: Bearer
                                __YOUR_API_KEY__',{`\n`}
                                &nbsp;&nbsp;'Content-Type: application/json'
                              </span>
                              {`\n`}
                              <span className="token punctuation"> {`}`}</span>
                              <span className="token punctuation">,</span>
                              {`\n`}
                              &nbsp;data
                              <span className="token punctuation">:</span> data
                              {`\n`}
                              <span className="token punctuation">{`}`}</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              {`\n`}
                              <span className="token function">axios</span>
                              <span className="token punctuation">(</span>
                              config<span className="token punctuation">)</span>
                              <span className="token punctuation">.</span>
                              <span className="token function">then</span>
                              <span className="token punctuation">(</span>
                              <span className="token punctuation">(</span>
                              <span className="token parameter">response</span>
                              <span className="token punctuation">)</span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token punctuation">{`{`}</span>
                              {`\n`}
                              <span className="token function"> console</span>
                              <span className="token punctuation">.</span>
                              <span className="token keyword">log</span>
                              <span className="token punctuation">(</span>
                              <span className="token keyword">JSON</span>
                              <span className="token punctuation">.</span>
                              <span className="token keyword">stringify</span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">response</span>
                              <span className="token punctuation">.</span>
                              <span className="token variable">data</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              <span className="token punctuation">{`}`}</span>
                              <span className="token punctuation">)</span>
                              {`\n`}
                              <span className="token punctuation">.</span>
                              <span className="token function">catch</span>
                              <span className="token punctuation">(</span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">error</span>
                              <span className="token punctuation">)</span>
                              <span className="token operator"> =</span>
                              <span className="token operator">&gt; </span>
                              <span className="token punctuation">{`{`}</span>
                              {`\n`}
                              <span className="token function"> console</span>
                              <span className="token punctuation">.</span>
                              <span className="token keyword">log</span>
                              <span className="token punctuation">(</span>
                              <span className="token variable">error</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                              {`\n`}
                              <span className="token punctuation">{`}`}</span>
                              <span className="token punctuation">)</span>
                              <span className="token punctuation">;</span>
                            </code>
                          </pre>
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                          <pre>
                            <code>
                              <span className="token keyword">require</span>
                              <span className="token string"> 'uri'</span>
                              {`\n`}
                              <span className="token keyword">require</span>
                              <span className="token string"> 'net/http'</span>
                              {`\n`}
                              {`\n`}
                              uri
                              <span className="token operator"> = </span>
                              <span className="token constant">URI</span>
                              <span className="token punctuation">(</span>
                              {selTr === "0" && (
                                <span className="token string">
                                  'https://www.activities.app/api/activities?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "1" && (
                                <span className="token string">
                                  'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">
                                  {" "}
                                  'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              <span className="token punctuation">)</span>{" "}
                              {`\n`}
                              {`\n`}
                              https
                              <span className="token operator"> = </span>
                              <span className="token constant">Net</span>
                              <span className="token punctuation">:</span>
                              <span className="token punctuation">:</span>
                              <span className="token constant">HTTP</span>
                              <span className="token punctuation">.</span>
                              <span className="token keyword">new</span>
                              <span className="token punctuation">(</span>
                              uri
                              <span className="token punctuation">.</span>
                              host
                              <span className="token punctuation">, </span>
                              url
                              <span className="token punctuation">.</span>
                              port
                              <span className="token punctuation">)</span>
                              {`\n`}
                              https
                              <span className="token punctuation">.</span>
                              use_ssl
                              <span className="token punctuation"> = </span>
                              <span className="token boolean constant">
                                true
                              </span>
                              {`\n`}
                              request
                              <span className="token operator"> = </span>
                              <span className="token constant">Net</span>
                              <span className="token punctuation">:</span>
                              <span className="token punctuation">:</span>
                              <span className="token constant">HTTP</span>
                              <span className="token punctuation">:</span>
                              <span className="token punctuation">:</span>
                              {(selTr === "0" || selTr === "1") && (
                                <span className="token string">'GET'</span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">'PUT'</span>
                              )}
                              <span className="token punctuation">.</span>
                              <span className="token keyword">new</span>
                              <span className="token punctuation">(</span>
                              url
                              <span className="token punctuation">)</span>
                              {`\n`}
                              request
                              <span className="token punctuation">[</span>
                              <span className="token string">
                                "Authorization"
                              </span>
                              <span className="token punctuation">]</span>
                              <span className="token operator"> = </span>
                              <span className="token double-quoted-string string">
                                "Bearer __YOUR_API_KEY__"
                              </span>
                              {`\n`}
                              {`\n`}
                              request
                              {selTr === "2" && (
                                <>
                                  <span className="token punctuation">[</span>
                                  <span className="token string">
                                    "Content-Type"
                                  </span>
                                  <span className="token punctuation">]</span>
                                  <span className="token operator"> = </span>
                                  <span className="token string">
                                    "application/json"
                                  </span>
                                  {`\n`}
                                  request
                                  <span className="token punctuation">.</span>
                                  body
                                  <span className="token operator"> = </span>
                                  <span className="token string">
                                    "{`{`}\r\n
                                    \"option_field1_title\":\"string\",\r\n
                                    \"option_field2_title\":\"string\",\r\n
                                    \"ad_title\": \"string\",\r\n
                                    \"ad_description\": \"string\", \r\n
                                    \"video\": \"string\",\r\n \"custom_terms\":
                                    \"string\" \r\n{`}`}"
                                  </span>
                                </>
                              )}
                              {`\n`}
                              {`\n`}
                              response
                              <span className="token operator"> = </span>
                              https
                              <span className="token punctuation">.</span>
                              request
                              <span className="token punctuation">(</span>
                              request
                              <span className="token punctuation">)</span>
                              {`\n`}
                              <span className="token function">puts</span>
                              &nbsp;response
                              <span className="token punctuation">.</span>
                              read_body
                            </code>
                          </pre>
                        </TabPanel>
                        {/* <TabPanel value={value} index={5}>
												Item Three
      								</TabPanel> */}
                        <TabPanel value={value} index={5}>
                          <pre>
                            <code>
                              <span className="token keyword">var </span>client
                              <span className="token operator"> = </span>
                              <span className="token keyword">new</span>
                              &nbsp;RestClient
                              <span className="token punctuation">(</span>
                              {selTr === "0" && (
                                <span className="token string">
                                  'https://www.activities.app/api/activities?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "1" && (
                                <span className="token string">
                                  'https://www.activities.app/api/bookings?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              {selTr === "2" && (
                                <span className="token string">
                                  {" "}
                                  'https://www.activities.app/api/activity/__YOUR_ACTIVITY_ID__?email=__YOUR_EMAIL__'
                                </span>
                              )}
                              <span className="token punctuation">;</span>
                              {`\n`}
                              client<span className="token punctuation">.</span>
                              Timeout
                              <span className="token operator"> = </span>-1{" "}
                              {`\n`}
                              <span className="token keyword">var </span>request
                              <span className="token operator"> = </span>
                              <span className="token keyword">new</span>
                              &nbsp;RestRequest
                              <span className="token punctuation">(</span>
                              Method.GET
                              <span className="token punctuation">);</span>
                              {`\n`}
                              request.AddHeader
                              <span className="token punctuation">(</span>
                              <span className="token string">
                                'Authorization'
                              </span>
                              <span className="token punctuation">, </span>
                              <span className="token string">
                                'Bearer __YOUR_API_KEY__'
                              </span>
                              <span className="token punctuation">);</span>
                              {`\n`}
                              {selTr === "2" && (
                                <>
                                  request.AddHeader
                                  <span className="token punctuation">(</span>
                                  <span className="token string">
                                    'Content-Type'
                                  </span>
                                  <span className="token punctuation">, </span>
                                  <span className="token string">
                                    'application/json'
                                  </span>
                                  <span className="token punctuation">);</span>
                                  {`\n`}
                                </>
                              )}
                              request.AddParameter
                              <span className="token punctuation">(</span>
                              {(selTr === "0" || selTr === "1") && (
                                <>
                                  <span className="token string">
                                    'text/plain'
                                  </span>
                                  <span className="token punctuation">, </span>
                                  <span className="token string">''</span>
                                </>
                              )}
                              {selTr === "2" && (
                                <>
                                  <span className="token string">
                                    'application/json'
                                  </span>
                                  <span className="token punctuation">, </span>
                                  <span className="token string">
                                    "{`{`}\r\n
                                    \"option_field1_title\":\"string\",\r\n
                                    \"option_field2_title\":\"string\",\r\n
                                    \"ad_title\": \"string\",\r\n
                                    \"ad_description\": \"string\", \r\n
                                    \"video\": \"string\",\r\n \"custom_terms\":
                                    \"string\" \r\n{`}`}"
                                  </span>
                                </>
                              )}
                              <span className="token punctuation">, </span>
                              ParameterType.RequestBody
                              <span className="token punctuation">);</span>
                              {`\n`}
                              IRestResponse response
                              <span className="token operator"> = </span>
                              client<span className="token punctuation">.</span>
                              <span className="token function">Execute</span>
                              <span className="token punctuation">(</span>
                              request
                              <span className="token punctuation">);</span>
                              {`\n`}
                              <span className="token function">Console</span>
                              <span className="token punctuation">.</span>
                              <span className="token keyword">WriteLine</span>
                              <span className="token punctuation">(</span>
                              response
                              <span className="token punctuation">.</span>
                              Content
                              <span className="token punctuation">);</span>
                            </code>
                          </pre>
                        </TabPanel>
                      </div>
                      <div className="response-content">
                        <h4 className="mt-3 mb-3">Response Data</h4>
                        <div
                          className="p-4 cu-radius scroller"
                          style={{ border: "1px solid #eee" }}
                        >
                          <pre>
                            {(selTr === "0" || selTr === "2") && (
                              <code>
                                <span className="token punctuation">[</span>
                                {`\n`}
                                <span> {`{`}</span>
                                {`\n`}
                                <span> "timestamp": {`{`}</span>
                                {`\n`}
                                <span> "_seconds": 1610947188,</span>
                                {`\n`}
                                <span> "_nanoseconds": 448000000</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "start_date": {`{`}</span>
                                {`\n`}
                                <span> "_seconds": 1610947188,</span>
                                {`\n`}
                                <span> "_nanoseconds": 448000000</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "is_feature_plan": "",</span>
                                {`\n`}
                                <span> "picture": [</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "https://firebasestorage.googleapis.com/v0/b/kidsapp-c8292.appspot.com/o/...",
                                </span>
                                {`\n`}
                                <span> ...</span>
                                {`\n`}
                                <span> ],</span>
                                {`\n`}
                                <span> "is_feature_day_remaining": 0,</span>
                                {`\n`}
                                <span> "end_date": {`{`}</span>
                                {`\n`}
                                <span> "_seconds": 1610947188,</span>
                                {`\n`}
                                <span> "_nanoseconds": 448000000</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "start_time": "09:00",</span>
                                {`\n`}
                                <span> "id": "9Vezotmi8osbU7bLNUtM",</span>
                                {`\n`}
                                <span> "age_group": {`{`}</span>
                                {`\n`}
                                <span> "status": "1",</span>
                                {`\n`}
                                <span> "under_age": true,</span>
                                {`\n`}
                                <span> "sequence_order": "4",</span>
                                {`\n`}
                                <span> "name": "13 - 17",</span>
                                {`\n`}
                                <span> "id": "YTcj6O..."</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "remaing_availability": 19,</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "covid_precautions": "We are following ...",
                                </span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "option_field2_title": "Do you have a
                                  friend?",
                                </span>
                                {`\n`}
                                <span> "price": 120,</span>
                                {`\n`}
                                <span> "camp_type": 1,</span>
                                {`\n`}
                                <span> "status": "0",</span>
                                {`\n`}
                                <span> "virtual_link": "",</span>
                                {`\n`}
                                <span> "remember_bring": "com, camera",</span>
                                {`\n`}
                                <span> "address": {`{`}</span>
                                {`\n`}
                                <span> "state": "CA",</span>
                                {`\n`}
                                <span> "city": "Mountain View",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "street": "121 East El Camino Real",
                                </span>
                                {`\n`}
                                <span> "country": "US",</span>
                                {`\n`}
                                <span> "postal_code": "94040"</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "is_feature": "1",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "option_field1_title": "Do you have com?",
                                </span>
                                {`\n`}
                                <span> "rating": 3.5,</span>
                                {`\n`}
                                <span> "end_time": "18:00",</span>
                                {`\n`}
                                <span> "ad_view": 71,</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "advertiser_id": "yGbILroOpbfP...",
                                </span>
                                {`\n`}
                                <span> "video": "..."</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "custom_terms": "1.Application of these Terms
                                  of Use\nThese terms of use ...",
                                </span>
                                {`\n`}
                                <span> "category_id": "...",</span>
                                {`\n`}
                                <span> "ad_title": "Paddleboard...",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "ad_description": "Paddleboard is ...",
                                </span>
                                {`\n`}
                                <span> "ad_click": 81,</span>
                                {`\n`}
                                <span> "date": "01/17/2021",</span>
                                {`\n`}
                                <span> "availability": 150</span>
                                {`\n`}
                                <span> {`}`}</span>
                                {`\n`}
                                <span className="token punctuation">]</span>
                              </code>
                            )}
                            {selTr === "1" && (
                              <code>
                                <span className="token punctuation">[</span>
                                {`\n`}
                                <span> {`{`}</span>
                                {`\n`}
                                <span> "timestamp": {`{`}</span>
                                {`\n`}
                                <span> "_seconds": 1608824561,</span>
                                {`\n`}
                                <span> "_nanoseconds": 832000000</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "child_dob": "01/01/2000",</span>
                                {`\n`}
                                <span> "status": "0",</span>
                                {`\n`}
                                <span> "child_medication": "none",</span>
                                {`\n`}
                                <span> "cancel_transaction_id": "",</span>
                                {`\n`}
                                <span> "child_allergy": "none",</span>
                                {`\n`}
                                <span> "price": 100,</span>
                                {`\n`}
                                <span> "date": "12/24/2020",</span>
                                {`\n`}
                                <span> "child_image": "...",</span>
                                {`\n`}
                                <span> "transaction_id": "pi_1I1vxtE...",</span>
                                {`\n`}
                                <span> "extra_session_title": "winter",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "advertiser_id": "...bfP2qBY637...",
                                </span>
                                {`\n`}
                                <span> "emergency_contact_number_1": "",</span>
                                {`\n`}
                                <span> "qr_code": "...firebase_url...",</span>
                                {`\n`}
                                <span> "coupon_code": "",</span>
                                {`\n`}
                                <span> "emergency_contact_number_2": "",</span>
                                {`\n`}
                                <span> "sended_email": true,</span>
                                {`\n`}
                                <span> "child_name": "Tony...",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "used_coupon_id": "...OsS4NF2Bt...",
                                </span>
                                {`\n`}
                                <span> "surname": "Idamso",</span>
                                {`\n`}
                                <span> "fee": "12.9",</span>
                                {`\n`}
                                <span> "extra_session_id": "",</span>
                                {`\n`}
                                <span> "option_field1_title": "",</span>
                                {`\n`}
                                <span> "guardians": [],</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "address": "1216 W 6th St, Coffeyville, KS
                                  67337, USA",
                                </span>
                                {`\n`}
                                <span> "ad_id": "...tmi8osbU7...",</span>
                                {`\n`}
                                <span> "option_field2_title": "",</span>
                                {`\n`}
                                <span> "discount": "",</span>
                                {`\n`}
                                <span> "child_gender": "Male",</span>
                                {`\n`}
                                <span>
                                  {" "}
                                  "user_id": "...P3LURTLbnjAlIvUz...",
                                </span>
                                {`\n`}
                                <span> "id": "...T5SFY0yKAR1...",</span>
                                {`\n`}
                                <span> "activity": {`{`}</span>
                                {`\n`}
                                <span> activity Object</span>
                                {`\n`}
                                <span> ...............</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> {`{`}</span>
                                {`\n`}
                                <span> "timestamp": {`{`}</span>
                                {`\n`}
                                <span> "_seconds": 1845824561,</span>
                                {`\n`}
                                <span> "_nanoseconds": 784210000</span>
                                {`\n`}
                                <span> {`}`},</span>
                                {`\n`}
                                <span> "child_dob": "03/05/1994",</span>
                                {`\n`}
                                <span> "status": "0",</span>
                                {`\n`}
                                <span> "child_medication": "none",</span>
                                {`\n`}
                                <span> "cancel_transaction_id": "",</span>
                                {`\n`}
                                <span> "child_allergy": "yes",</span>
                                {`\n`}
                                <span> ........................,</span>
                                {`\n`}
                                <span> {`}`}</span>
                                {`\n`}
                                <span className="token punctuation">]</span>
                              </code>
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>
                    <div className="get-bookings-api"></div>
                    <div className="error-content">
                      <h4 className="mt-3 mb-3">
                        <MultiLang text="response_data" />
                      </h4>
                      <p>
                        <MultiLang text="api_key_error" />
                      </p>
                      <div
                        className="p-4 cu-radius"
                        style={{ border: "1px solid #eee" }}
                      >
                        <ul>
                          <li className="p-2">
                            <b>400</b> - <MultiLang text="failed_auth_token" />
                          </li>
                          <li className="p-2">
                            <b>401</b> - <MultiLang text="access_provided" />
                          </li>
                          <li className="p-2">
                            <b>403</b> -{" "}
                            <MultiLang text="access_token_not_valid" />
                          </li>
                          <li className="p-2">
                            <b>404</b> - <MultiLang text="cant_find_resource" />
                          </li>
                          <li className="p-2">
                            <b>500</b> -{" "}
                            <MultiLang text="indicate_server_encountered" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*<!-- ends: .atbd_author_module -->*/}{" "}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default ApiDocument;
