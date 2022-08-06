import React, { Component, Fragment } from 'react';

export class SectionTitleImg extends Component {

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-img">
                            <h2>{this.props.title}<span></span></h2>
                            <p>{this.props.content}</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}