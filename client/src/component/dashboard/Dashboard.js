import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../redux/actions/profile';
import Spinner from '../util/Spinner'
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardAction';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])

    return (
        loading && profile == null ?
            <Spinner /> :
            <Fragment>
                <h1 className="large text-primary">User Info</h1>
                <p className="lead">
                    <i style={{color: 'green'}}className="fas fa-user" /> {user && user.name}</p>
                {profile ?
                    (
                        <Fragment>
                            <DashboardActions />
                            <Experience experience={profile.experience} />
                            <Education education={profile.education} />

                            <div className="my-2">
                                <button className="btn btn-danger" style={{ float: 'right' }} onClick={deleteAccount}>Delete My Account</button>
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <p>Let's Create Your Profile :)</p>
                            <Link to="/create-profile" className="btn btn-primary my-1">
                                Create Profile</Link>
                            <div className="my-2">
                                <button className="btn btn-danger" style={{ float: 'right' }} onClick={deleteAccount}>Delete My Account</button>
                            </div>
                        </Fragment>

                    )}
            </Fragment>
    )

}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
