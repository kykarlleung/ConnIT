import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../redux/actions/profile';

const initialState = {
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
};

const ProfileForm = ({
    profile: { profile, loading },
    createProfile,
    getCurrentProfile,
    history }) => {

    const [formData, setFormData] = useState(initialState);
    const [displaySocial, toggleSocial] = useState(false);

    useEffect(() => {

        // if there is no profile loaded get current profile
        if (!profile){
            getCurrentProfile()
        }

        // if no loading and there is a profile
        if (!loading && profile) {
          // spread the initial state data to the profileData
          const profileData = { ...initialState };

          // for existing keys add the data to the profileData
          for (const key in profile) {
            if (key in profileData) profileData[key] = profile[key];
          }

          // for existing social keys add the data to the profileData
          for (const key in profile.social) {
            if (key in profileData) profileData[key] = profile.social[key];
          }

          // for existing skills add the data to the profileData
          if (Array.isArray(profileData.skills))
            profileData.skills = profileData.skills.join(', ');

          // fill the form data  
          setFormData(profileData);
        }
        // dependencies array, when they change the useEffect runs
      }, [loading, getCurrentProfile]);

    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history, profile ? true : false);
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Edit Your Profile</h1>
            <small>* = required field</small>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <select name="status" value={status} onChange={onChange}>
                        <option>* Select Professional Status</option>
                        <option value="Developer">Developer</option>
                        <option value="Junior Developer">Junior Developer</option>
                        <option value="Senior Developer">Senior Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Student or Learning">Student or Learning</option>
                        <option value="Instructor">Instructor or Teacher</option>
                        <option value="Intern">Intern</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Skills"
                        name="skills"
                        value={skills}
                        onChange={onChange} />
                    <small className="form-text">Please use comma(,) separated values (eg. Java, C++, JavaScript)</small>
                </div>

                <div className="form-group">
                    <textarea
                        placeholder="A short bio of yourself"
                        name="bio"
                        value={bio}
                        onChange={onChange} />
                    {/* <small className="form-text">Introduce a bit of yourself</small> */}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Personal Website"
                        name="website"
                        value={website}
                        onChange={onChange} />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
                        onChange={onChange} />
                    <small className="form-text">City & state (eg. New York, NY)</small>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        value={githubusername}
                        onChange={onChange} />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Company"
                        name="company"
                        value={company}
                        onChange={onChange} />
                </div>

                <div className="my-2">
                    <button
                        onClick={() => toggleSocial(!displaySocial)}
                        type="button"
                        className="btn btn-light">
                        Social Network Links</button>
                </div>

                {displaySocial && (
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x" />
                            <input
                                type="text"
                                placeholder="Twitter URL"
                                name="twitter"
                                value={twitter}
                                onChange={onChange} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x" />
                            <input
                                type="text"
                                placeholder="Facebook URL"
                                name="facebook"
                                value={facebook}
                                onChange={onChange} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-youtube fa-2x" />
                            <input
                                type="text"
                                placeholder="YouTube URL"
                                name="youtube"
                                value={youtube}
                                onChange={onChange} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-linkedin fa-2x" />
                            <input
                                type="text"
                                placeholder="Linkedin URL"
                                name="linkedin"
                                value={linkedin}
                                onChange={onChange} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x" />
                            <input
                                type="text"
                                placeholder="Instagram URL"
                                name="instagram"
                                value={instagram}
                                onChange={onChange} />
                        </div>
                    </Fragment>
                )}

                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    );
};

ProfileForm.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(ProfileForm);