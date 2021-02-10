import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../util/Spinner';
import ProfileItem from './ProfilesItems';
import { getAllProfiles } from '../../redux/actions/profile';

const Profiles = ({ profile: { profiles, loading }, getAllProfiles }) => {
    useEffect(() => {
        getAllProfiles();
    }, [getAllProfiles]);

    return (
        <Fragment>
            {loading ? (
                <Spinner />) :
                (<Fragment>
                    <h1 className='large text-primary'>Awesome Developers around the World</h1>
                    <p className='lead'> Let's connect with the Developers</p>
                    <div className='profiles'>
                        {profiles.length > 0 ?
                            (profiles.map(profile => (<ProfileItem key={profile._id} profile={profile} />))) :
                            (<h4>No profiles found...</h4>)}
                    </div>
                </Fragment>
                )}
        </Fragment>
    );
};

Profiles.propTypes = {
    getAllProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);