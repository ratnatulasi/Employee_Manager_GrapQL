const { db } = require('../db/pgAdmin');
const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString, GraphQLList } = graphql;
const { ManagerType, EmployeeType } = require('./types');

const RootQuery = new GraphQLObjectType({
    name : "RootQueryType",
    type: "Query",
    fields: {
        manager: {
            type : ManagerType,
            args : { manager_id : { type : graphql.GraphQLID } },
            resolve: async(parentArgs, args) => {
                const query = `select * from tbl_manager where manager_id = $1`;

                const values = [args.manager_id];

                return await db.one(query, values);
            }
        },
        managers: {
            type : new GraphQLList(ManagerType),
            resolve: async(parentArgs, args) => {
                const query = `select * from tbl_manager`;

                return await db.many(query);
            }
        },
        employee: {
            type : EmployeeType,
            args : { employee_id : { type : graphql.GraphQLID } },
            resolve: async(parentArgs, args) => {
                const query = `select * from tbl_employee where employee_id = $1`;

                const values = [args.employee_id];

                return await db.one(query, values);
            }
        },
        employees: {
            type : new GraphQLList(EmployeeType),
            resolve: async(parentArgs, args) => {
                const query = `select * from tbl_employee`;

                return await db.many(query);
            }
        },
    }
})

exports.query = RootQuery;