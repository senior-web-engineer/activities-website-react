import React, { Component, Fragment } from 'react';

export class SectionTitle extends Component {

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>{this.props.title}<span>{this.props.title1}</span></h2>
                            <p>{this.props.content}</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}