const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString, GraphQLList } = graphql;

const ManagerType = new GraphQLObjectType({
    name : "Manager",
    type : "Query",
    fields : {
        manager_id : { type : GraphQLString },
        manager_name : { type : GraphQLString },
        manager_email : { type : GraphQLString },
    }
})

const EmployeeType = new GraphQLObjectType({
    name : "Employee",
    type : "Query",
    fields : {
        employee_id : { type : GraphQLString },
        manager_id : { type : GraphQLString },
        employee_name : { type : GraphQLString },
        employee_email : { type : GraphQLString },
    }
})

exports.ManagerType = ManagerType
exports.EmployeeType = EmployeeType