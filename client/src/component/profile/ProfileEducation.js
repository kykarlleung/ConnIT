import React from 'react';
import PropTypes from 'prop-types';

const formatDate = (date) => {
    return new Intl.DateTimeFormat().format(new Date(date));
}

const ProfileEducation = ({
    education: { school, degree, major, to, from, description }
}) => (
    <div>
        <h3 className="text-dark">{school}</h3>
        <p>{formatDate(from)} - {to ? formatDate(to) : 'Now'}</p>
        <p><strong>Degree: </strong> {degree}</p>
        <p><strong>Major: </strong> {major}</p>
        <p><strong>Description: </strong> {description}</p>
    </div>
);

ProfileEducation.propTypes = {
    education: PropTypes.object.isRequired
};

export default ProfileEducation;