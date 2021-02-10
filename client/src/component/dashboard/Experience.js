import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../redux/actions/profile';

const Experience = ({ experience, deleteExperience }) => {

    const formatDate = (date) => {
        return new Intl.DateTimeFormat().format(new Date(date));
    }

    const experiences = experience ? experience.map((exp) => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Now'}
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)}>Delete</button>
            </td>
        </tr>
    )) : null ;

    return (
        <Fragment>
            <h2 className="my-2">Experiences</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Title of Position</th>
                        <th>Working Years</th>
                        <th style={{background: "none"}}/>
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);