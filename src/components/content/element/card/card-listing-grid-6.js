import React, { Component } from "react";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import toastr from "toastr";
import { setFavouriteData } from "../../../../Store/action/favourite";
import CardListingCSV from "./card-listing-csv";
import CardListingDatabase from "./card-listing-database";

class ListingCardGrid6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      arrayData: [],
      totalpage: 0,
      activePage: 1,
      startNum: 0,
    };
  }

  componentDidMount() {
    this.setState({
      list: this.props.list,
      totalpage: this.props.list.length,
      arrayData: this.props.list,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list,
      totalpage: nextProps.list.length,
      arrayData: nextProps.list,
      activePage: 1,
      startNum: 0,
    });
  }

  nextSession = (id) => {
    const adLists = this.state.arrayData;
    adLists.map((item) => {
      if (item.listing_id === id) {
        if (item.selSessionKey === item.sessions.length - 1) {
          item["selSessionKey"] = 0;
        } else {
          item["selSessionKey"] = item.selSessionKey + 1;
        }
      }
      return item;
    });
    this.setState({ arrayData: adLists });
  };

  setFavorite = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toastr.info("Please sign in page!");
      return false;
    }
    this.state.list
      .filter((item) => item.id === id)
      .forEach((item) => (item.favFlag = !item.favFlag));
    const data = this.state.list.filter((item) => item.id === id);
    this.setState({
      list: this.state.list,
    });
    this.props.setFavouriteData(data);
  };

  handlePageChange = (e) => {
    this.setState({
      activePage: e,
      startNum: e - 1,
      arrayData: this.state.list,
    });
  };
  render() {
    return (
      <>
        <div className="row">
          {(this.state.arrayData ?? [])
            ?.slice(this.state.startNum * 6, this.state.startNum * 6 + 6)
            .map((item, key) =>
              Boolean(item?.activityType) ? (
                <CardListingCSV
                  currency={this.props.currency}
                  item={item}
                  key={this.state.startNum * 6 + key}
                  className="col-lg-6 col-sm-6"
                />
              ) : (
                <CardListingDatabase
                  item={item}
                  currency={this.props.currency}
                  handleSelectFavorite={this.setFavorite}
                  nextSession={this.nextSession}
                  key={this.state.startNum * 6 + key}
                  className="col-lg-6 col-sm-6"
                />
              )
            )}
        </div>
        <div className="row">
          <div className="p-left-15">
            <Pagination
              prevPageText="Prev"
              nextPageText="Next"
              firstPageText="First"
              lastPageText="Last"
              activePage={this.state.activePage}
              itemsCountPerPage={6}
              totalItemsCount={this.state.totalpage}
              pageRangeDisplayed={5}
              itemClass="page-item"
              linkClass="page-link"
              onChange={(e) => this.handlePageChange(e)}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.app.currency.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFavouriteData: (data) => dispatch(setFavouriteData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListingCardGrid6);
