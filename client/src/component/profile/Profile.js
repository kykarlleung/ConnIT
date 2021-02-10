import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../util/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import { getUserProfileById } from './../../redux/actions/profile';

const Profile = ({
    profile: { profile },
    match: { params: { id } },
    getUserProfileById
}) => {

    useEffect(() => {
        // console.log(`id : ${id}`)
        getUserProfileById(id);
    }, [getUserProfileById, id]);

    return (
        <Fragment>
            {profile === null ? (
                <Spinner />
            ) : (
                    <Fragment>
                        <Link to="/profiles" className="btn btn-light">Back</Link>
                        <div className="profile-grid my-1">
                            <ProfileTop profile={profile} />
                            <ProfileAbout profile={profile} />
                            <div className="profile-exp bg-white p-2">
                                <h2 className="text-primary">Experience</h2>
                                {profile.experience.length > 0 ? (
                                    <Fragment>
                                        {profile.experience.map((experience) => (
                                            <ProfileExperience
                                                key={experience._id}
                                                experience={experience}
                                            />
                                        ))}
                                    </Fragment>
                                ) : (
                                        <h4>No experience credentials</h4>
                                    )}
                            </div>

                            <div className="profile-edu bg-white p-2">
                                <h2 className="text-primary">Education</h2>
                                {profile.education.length > 0 ? (
                                    <Fragment>
                                        {profile.education.map((education) => (
                                            <ProfileEducation
                                                key={education._id}
                                                education={education}
                                            />
                                        ))}
                                    </Fragment>
                                ) : (
                                        <h4>No education credentials</h4>
                                    )}
                            </div>
                        </div>
                    </Fragment>
                )}
        </Fragment>
    );
};

Profile.propTypes = {
    getUserProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getUserProfileById })(Profile);