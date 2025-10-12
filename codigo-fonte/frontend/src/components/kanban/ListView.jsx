import React from 'react';

const ListView = ({ tasks }) => {
    return (
        <div className="card bg-white shadow-sm border border-gray-200 rounded-xl">
            <div className="card-body">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Título da Tarefa</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                    <tr key={task.id} className="hover">
                                        <td>{task.title}</td>
                                        <td><span className="badge badge-neutral">{task.status}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center py-8 text-gray-500">
                                        Nenhuma tarefa encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListView;