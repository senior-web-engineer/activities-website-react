import React, {Fragment, Component} from 'react';

export class Favorite extends Component {
    render () {
        return (
            <Fragment>
                <div className="atbd_author_module">
                    <div className="atbd_content_module cu-radius">
                        <div className="atbd_content_module__tittle_area">
                            <div className="atbd_area_title">
                                <h4><span className="la la-heart"></span>My Favorite</h4>
                            </div>
                        </div>

                        <div className="atbdb_content_module_contents">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 cu-header ">Activity Name</div>
                                    <div className="col-md-2 cu-header ">Category</div>
                                    <div className="col-md-2 cu-header ">Price ($)</div>
                                    <div className="col-md-2 cu-header ">Action</div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Tesd Restaurant Towers</div>
                                    <div className="col-md-2  cu-body">Soccar</div>
                                    <div className="col-md-2  cu-body">99.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Sydney Restaurant Towers</div>
                                    <div className="col-md-2  cu-body">Paddle board</div>
                                    <div className="col-md-2  cu-body">79.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Kung Food & Drinks</div>
                                    <div className="col-md-2  cu-body">Art</div>
                                    <div className="col-md-2  cu-body">59.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Favorite Place Fog Bank</div>
                                    <div className="col-md-2  cu-body">Soccar</div>
                                    <div className="col-md-2  cu-body">129.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Flanders Heat & Air Systems</div>
                                    <div className="col-md-2  cu-body">Soccar</div>
                                    <div className="col-md-2  cu-body">29.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                                <div className="row cu-row">
                                    <div className="col-md-6  cu-body" style={{color: "#358804"}}>Store Clothing Shopping Mall</div>
                                    <div className="col-md-2  cu-body">Soccar</div>
                                    <div className="col-md-2  cu-body">89.00</div>
                                    <div className="col-md-2  cu-body"><i className="la la-trash la-2x cu-setting-icon"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}