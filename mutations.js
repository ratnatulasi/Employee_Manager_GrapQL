const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql;
const { ManagerType, EmployeeType } = require('./types');
const { db } = require('../db/pgAdmin');

const RootMutation = new GraphQLObjectType({
    name: "RootMutationType",
    type: "Mutation",
    fields: {
        addManager: {
            type: ManagerType,
            args: {
                manager_name: { type: GraphQLString },
                manager_email: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const query = `INSERT INTO tbl_manager(manager_name, manager_email) VALUES ($1, $2) RETURNING *`;

                const values = [
                    args.manager_name,
                    args.manager_email
                ];

                return await db.one(query, values)
            }
        },
        addEmployee: {
            type: EmployeeType,
            args: {
                employee_name: { type: GraphQLString },
                employee_email: { type: GraphQLString },
                manager_id: { type: graphql.GraphQLInt }
            },
            resolve: async (parent, args) => {
                const query = `INSERT INTO tbl_employee(employee_name, employee_email, manager_id) VALUES ($1, $2, $3) RETURNING *`;

                const values = [
                    args.employee_name,
                    args.employee_email,
                    args.manager_id
                ];

                return await db.one(query, values)
            }
        },

        updateManager: {
            type: ManagerType,
            args: {
                manager_id: { type: graphql.GraphQLInt },
                manager_name: { type: GraphQLString },
                manager_email: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const query = `UPDATE tbl_manager SET manager_name = $2, manager_email = $3 WHERE manager_id = $1  RETURNING *`;

                const values = [
                    args.manager_id,
                    args.manager_name,
                    args.manager_email
                ];

                return await db.one(query, values)
            }
        },
        updateEmployee: {
            type: EmployeeType,
            args: {
                employee_id: { type: graphql.GraphQLInt },
                employee_name: { type: GraphQLString },
                employee_email: { type: GraphQLString },
                manager_id: { type: graphql.GraphQLInt }
            },
            resolve: async (parent, args) => {
                const query = `UPDATE tbl_employee SET employee_name = $2, employee_email = $3, manager_id = $4 WHERE employee_id  = $1 RETURNING *`;

                const values = [
                    args.employee_id,
                    args.employee_name,
                    args.employee_email,
                    args.manager_id
                ];

                return await db.one(query, values)
            }
        },

        removeManager: {
            type: ManagerType,
            args: {
                manager_id: { type: graphql.GraphQLInt }
            },
            resolve: async (parent, args) => {
                console.log("removeManager", args);

                try {
                    await db.one(`SELECT * FROM tbl_employee WHERE manager_id = $1`, [args.manager_id])
                        .then(async (res) => {
                            const employee = res;

                            if ('employee_id' in employee) {
                                await db.one(`DELETE FROM tbl_employee WHERE employee_id = $1`, [employee.employee_id])
                            }
                        })
                        .catch(error => {
                            console.log("error", error);
                        })


                    const query = `DELETE FROM tbl_manager WHERE manager_id = $1 RETURNING *`;

                    const values = [
                        args.manager_id
                    ];

                    return await db.one(query, values)
                } catch (error) {
                    console.log("removeManager error", error);
                }
            }
        },
        removeEmployee: {
            type: EmployeeType,
            args: {
                employee_id: { type: graphql.GraphQLInt }
            },
            resolve: async (parent, args) => {

                const query = `DELETE FROM tbl_employee WHERE employee_id = $1 RETURNING *`;

                const values = [
                    args.employee_id
                ];

                return await db.one(query, values)
            }
        }
    }
});

exports.mutation = RootMutation;