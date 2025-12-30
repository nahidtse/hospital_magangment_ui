import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <Fragment>
            <footer className="footer mt-auto py-3 bg-white text-center">
                <div className="container">
                    <span className="text-muted"> Copyright © <span id="year">{new Date().getFullYear()}&nbsp;</span>
                        <Link to="#" className="text-dark fw-semibold">The Software Engineers </Link>.Designed by <Link to="#">
                            <span className="fw-semibold text-primary text-decoration-underline">TSE Dev Team</span>
                        </Link> All rights reserved
                    </span>
                </div>
            </footer>
        </Fragment>
    )
}

export default Footer;