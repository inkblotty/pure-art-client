import React from 'react';

class ProjectMosaicList extends React.Component {

    // static defaultProps = { // :( can't use defaultProps this way yet. upgrade me!
    //     type: 'active',
    // };

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
        };
    }

    componentDidMount() {
        const { type } = this.props;
        // grab projects by list type

        const projects = [
            { name: 'example1' },
            { name: 'example2' },
        ];
        this.setState({ projects });
    }

    render() {
        const { projects } = this.state;
        const { type } = this.props;

        // make sure every mapped list uses a 'key' prop so React can track each element
        return (
            <ul className='mosaic-grid'>
                {projects.map((project, i) => (
                    <li key={`${type}List-project${i}`}>
                        {project.name || 'unknown project'}
                    </li>
                ))}
            </ul>
        );
    }
}

export default ProjectMosaicList;
